// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/**
 * @title CoupletFuAINFT
 * @dev 春节春联 NFT 智能合约
 * @notice 用户可以铸造春联 NFT，图片URL上链，元数据在链上动态生成
 */
contract CoupletFuAINFT is ERC721, ERC721Enumerable, Ownable {
    using Strings for uint256;

    // ============ 状态变量 ============

    uint256 private _nextTokenId;

    // 春联核心内容结构
    struct CoupletContent {
        string upperLine;       // 上联
        string lowerLine;       // 下联
        string horizontalScroll; // 横批
        string imageUrl;        // 图片URL (IPFS或HTTP链接)
        uint256 mintTime;       // 铸造时间
    }

    // TokenID => 春联内容
    mapping(uint256 => CoupletContent) private _coupletContent;

    // TokenID => 点赞数
    mapping(uint256 => uint256) private _likes;

    // 用户地址 => TokenID => 是否点赞
    mapping(address => mapping(uint256 => bool)) private _userLikes;

    // 铸造费用 (可设置为0进行免费铸造)
    uint256 public mintFee;

    // ============ 事件 ============

    event CoupletMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string upperLine,
        string lowerLine,
        string horizontalScroll,
        string imageUrl
    );

    event MintFeeUpdated(uint256 oldFee, uint256 newFee);

    event CoupletLiked(
        uint256 indexed tokenId,
        address indexed user,
        uint256 newLikeCount
    );

    event CoupletUnliked(
        uint256 indexed tokenId,
        address indexed user,
        uint256 newLikeCount
    );

    // ============ 构造函数 ============

    constructor(address initialOwner)
        ERC721("Couplet Fu AI NFT", "CFUAI") 
        Ownable(initialOwner)
    {
        mintFee = 0; // 默认免费铸造
    }

    // ============ 核心功能 ============

    /**
     * @notice 铸造春联 NFT
     * @param upperLine 上联
     * @param lowerLine 下联
     * @param horizontalScroll 横批
     * @param imageUrl 图片URL (IPFS或HTTP链接，如：ipfs://...或https://...)
     * @return tokenId 铸造的 NFT Token ID
     */
    function mintCouplet(
        string memory upperLine,
        string memory lowerLine,
        string memory horizontalScroll,
        string memory imageUrl
    ) 
        public 
        payable 
        returns (uint256) 
    {
        require(msg.value >= mintFee, "CoupletFuAINFT: Insufficient mint fee");
        require(bytes(upperLine).length > 0, "CoupletFuAINFT: Upper line is empty");
        require(bytes(lowerLine).length > 0, "CoupletFuAINFT: Lower line is empty");
        require(bytes(horizontalScroll).length > 0, "CoupletFuAINFT: Horizontal scroll is empty");
        require(bytes(imageUrl).length > 0, "CoupletFuAINFT: Image URL is empty");

        uint256 tokenId = _nextTokenId++;

        _safeMint(msg.sender, tokenId);

        // 保存春联内容和图片URL
        _coupletContent[tokenId] = CoupletContent({
            upperLine: upperLine,
            lowerLine: lowerLine,
            horizontalScroll: horizontalScroll,
            imageUrl: imageUrl,
            mintTime: block.timestamp
        });

        emit CoupletMinted(tokenId, msg.sender, upperLine, lowerLine, horizontalScroll, imageUrl);

        return tokenId;
    }

    // ============ 查询功能 ============

    /**
     * @notice 获取春联内容
     * @param tokenId Token ID
     * @return 春联内容结构
     */
    function getCoupletContent(uint256 tokenId) public view returns (CoupletContent memory) {
        _requireOwned(tokenId);
        return _coupletContent[tokenId];
    }

    /**
     * @notice 批量获取春联内容
     * @param tokenIds Token ID 数组
     * @return 春联内容数组
     */
    function getBatchCoupletContent(uint256[] memory tokenIds) 
        public 
        view 
        returns (CoupletContent[] memory) 
    {
        CoupletContent[] memory contents = new CoupletContent[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            // 使用 _ownerOf 检查是否存在，如果不存在会返回 address(0)
            if (_ownerOf(tokenIds[i]) != address(0)) {
                contents[i] = _coupletContent[tokenIds[i]];
            }
        }
        return contents;
    }

    /**
     * @notice 获取下一个 Token ID
     * @return 下一个 Token ID
     */
    function getNextTokenId() public view returns (uint256) {
        return _nextTokenId;
    }

    /**
     * @notice 获取 NFT 点赞数
     * @param tokenId Token ID
     * @return 点赞数
     */
    function getLikeCount(uint256 tokenId) public view returns (uint256) {
        _requireOwned(tokenId);
        return _likes[tokenId];
    }

    /**
     * @notice 检查用户是否已点赞
     * @param tokenId Token ID
     * @param user 用户地址
     * @return 是否已点赞
     */
    function hasUserLiked(uint256 tokenId, address user) public view returns (bool) {
        return _userLikes[user][tokenId];
    }

    // ============ 互动功能 ============

    /**
     * @notice 点赞 NFT
     * @param tokenId Token ID
     */
    function likeCouplet(uint256 tokenId) public {
        _requireOwned(tokenId);
        require(!_userLikes[msg.sender][tokenId], "CoupletFuAINFT: Already liked");
        
        _userLikes[msg.sender][tokenId] = true;
        _likes[tokenId]++;
        
        emit CoupletLiked(tokenId, msg.sender, _likes[tokenId]);
    }

    /**
     * @notice 取消点赞 NFT
     * @param tokenId Token ID
     */
    function unlikeCouplet(uint256 tokenId) public {
        _requireOwned(tokenId);
        require(_userLikes[msg.sender][tokenId], "CoupletFuAINFT: Not liked yet");
        
        _userLikes[msg.sender][tokenId] = false;
        _likes[tokenId]--;
        
        emit CoupletUnliked(tokenId, msg.sender, _likes[tokenId]);
    }

    // ============ 管理员功能 ============

    /**
     * @notice 设置铸造费用 (仅管理员)
     * @param newFee 新的铸造费用
     */
    function setMintFee(uint256 newFee) public onlyOwner {
        uint256 oldFee = mintFee;
        mintFee = newFee;
        emit MintFeeUpdated(oldFee, newFee);
    }

    /**
     * @notice 提取合约余额 (仅管理员)
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "CoupletFuAINFT: No balance to withdraw");
        payable(owner()).transfer(balance);
    }

    // ============ 内部函数 ============

    /**
     * @dev 生成链上 Token URI (符合 ERC721 Metadata 标准)
     * @param tokenId Token ID
     * @return Base64 编码的 JSON metadata
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721)
        returns (string memory)
    {
        _requireOwned(tokenId);

        CoupletContent memory content = _coupletContent[tokenId];
        
        // 构建 JSON metadata
        string memory json = string(
            abi.encodePacked(
                '{"name":"FuAI Couplet #',
                tokenId.toString(),
                '","description":"AI-generated Chinese New Year couplet NFT","image":"',
                content.imageUrl,
                '","attributes":[',
                '{"trait_type":"Upper Line","value":"', content.upperLine, '"},',
                '{"trait_type":"Lower Line","value":"', content.lowerLine, '"},',
                '{"trait_type":"Horizontal Scroll","value":"', content.horizontalScroll, '"},',
                '{"trait_type":"Mint Time","display_type":"date","value":', 
                Strings.toString(content.mintTime), 
                '}]}'
            )
        );

        // 返回 Base64 编码的 data URI
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(bytes(json))
            )
        );
    }

    /**
     * @dev 重写以支持 ERC721Enumerable
     */
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    /**
     * @dev 重写以支持 ERC721Enumerable
     */
    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    /**
     * @dev 重写以支持接口检查
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
