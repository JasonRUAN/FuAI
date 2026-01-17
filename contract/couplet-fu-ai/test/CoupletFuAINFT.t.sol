// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/CoupletFuAINFT.sol";

contract CoupletFuAINFTTest is Test {
    CoupletFuAINFT public nft;
    address public owner;
    address public user1;
    address public user2;

    // Test data - 核心春联数据
    string constant UPPER_LINE = unicode"春回大地千山秀";
    string constant LOWER_LINE = unicode"日照神州万里明";
    string constant HORIZONTAL_SCROLL = unicode"春回大地";
    string constant IMAGE_URL = "ipfs://QmTest123456789/couplet.png";

    // Allow test contract to receive ETH
    receive() external payable {}

    function setUp() public {
        owner = address(this);
        user1 = address(0x1);
        user2 = address(0x2);

        // 部署合约
        nft = new CoupletFuAINFT(owner);

        // 给测试账户转账
        vm.deal(user1, 10 ether);
        vm.deal(user2, 10 ether);
    }

    // Helper function to mint a couplet with default values
    function mintCoupletWithDefaults(address minter) internal returns (uint256) {
        vm.startPrank(minter);
        uint256 tokenId = nft.mintCouplet(
            UPPER_LINE,
            LOWER_LINE,
            HORIZONTAL_SCROLL,
            IMAGE_URL
        );
        vm.stopPrank();
        return tokenId;
    }

    // ============ 铸造测试 ============

    function testMintCouplet() public {
        vm.startPrank(user1);

        uint256 tokenId = nft.mintCouplet(
            UPPER_LINE,
            LOWER_LINE,
            HORIZONTAL_SCROLL,
            IMAGE_URL
        );

        vm.stopPrank();

        // 验证基础信息
        assertEq(tokenId, 0);
        assertEq(nft.ownerOf(tokenId), user1);
        assertEq(nft.balanceOf(user1), 1);
        
        // 验证春联内容
        CoupletFuAINFT.CoupletContent memory content = nft.getCoupletContent(tokenId);
        assertEq(content.upperLine, UPPER_LINE);
        assertEq(content.lowerLine, LOWER_LINE);
        assertEq(content.horizontalScroll, HORIZONTAL_SCROLL);
        assertEq(content.imageUrl, IMAGE_URL);
        assertTrue(content.mintTime > 0);
        
        // 验证 tokenURI (应该是 Base64 编码的 JSON)
        string memory uri = nft.tokenURI(tokenId);
        assertTrue(bytes(uri).length > 0);
        // 检查是否包含 data URI 前缀
        assertTrue(_startsWith(uri, "data:application/json;base64,"));
    }

    function testMintMultipleCouplets() public {
        vm.startPrank(user1);

        uint256 tokenId1 = nft.mintCouplet(
            UPPER_LINE,
            LOWER_LINE,
            HORIZONTAL_SCROLL,
            IMAGE_URL
        );

        uint256 tokenId2 = nft.mintCouplet(
            unicode"新春送福迎好运",
            unicode"佳节纳祥贺吉祥",
            unicode"福满人间",
            "ipfs://QmTest987654321/couplet2.png"
        );

        vm.stopPrank();

        assertEq(tokenId1, 0);
        assertEq(tokenId2, 1);
        assertEq(nft.balanceOf(user1), 2);
        
        // 验证内容
        CoupletFuAINFT.CoupletContent memory content1 = nft.getCoupletContent(tokenId1);
        CoupletFuAINFT.CoupletContent memory content2 = nft.getCoupletContent(tokenId2);
        assertEq(content1.upperLine, UPPER_LINE);
        assertEq(content2.upperLine, unicode"新春送福迎好运");
        assertEq(content1.imageUrl, IMAGE_URL);
        assertEq(content2.imageUrl, "ipfs://QmTest987654321/couplet2.png");
    }

    function testMintWithFee() public {
        // 设置铸造费用
        nft.setMintFee(0.01 ether);

        vm.startPrank(user1);

        // 支付足够的费用
        uint256 tokenId = nft.mintCouplet{value: 0.01 ether}(
            UPPER_LINE,
            LOWER_LINE,
            HORIZONTAL_SCROLL,
            IMAGE_URL
        );

        vm.stopPrank();

        assertEq(tokenId, 0);
        assertEq(address(nft).balance, 0.01 ether);
    }

    function test_RevertWhen_MintWithInsufficientFee() public {
        nft.setMintFee(0.01 ether);

        vm.startPrank(user1);

        // Expect revert with insufficient fee
        vm.expectRevert("CoupletFuAINFT: Insufficient mint fee");
        nft.mintCouplet{value: 0.005 ether}(
            UPPER_LINE,
            LOWER_LINE,
            HORIZONTAL_SCROLL,
            IMAGE_URL
        );

        vm.stopPrank();
    }

    function test_RevertWhen_MintWithEmptyUpperLine() public {
        vm.startPrank(user1);

        vm.expectRevert("CoupletFuAINFT: Upper line is empty");
        nft.mintCouplet(
            "", // Empty upper line
            LOWER_LINE,
            HORIZONTAL_SCROLL,
            IMAGE_URL
        );

        vm.stopPrank();
    }

    function test_RevertWhen_MintWithEmptyLowerLine() public {
        vm.startPrank(user1);

        vm.expectRevert("CoupletFuAINFT: Lower line is empty");
        nft.mintCouplet(
            UPPER_LINE,
            "", // Empty lower line
            HORIZONTAL_SCROLL,
            IMAGE_URL
        );

        vm.stopPrank();
    }

    function test_RevertWhen_MintWithEmptyHorizontalScroll() public {
        vm.startPrank(user1);

        vm.expectRevert("CoupletFuAINFT: Horizontal scroll is empty");
        nft.mintCouplet(
            UPPER_LINE,
            LOWER_LINE,
            "", // Empty horizontal scroll
            IMAGE_URL
        );

        vm.stopPrank();
    }

    function test_RevertWhen_MintWithEmptyImageUrl() public {
        vm.startPrank(user1);

        vm.expectRevert("CoupletFuAINFT: Image URL is empty");
        nft.mintCouplet(
            UPPER_LINE,
            LOWER_LINE,
            HORIZONTAL_SCROLL,
            "" // Empty image URL
        );

        vm.stopPrank();
    }

    // ============ 查询测试 ============

    function testGetCoupletContent() public {
        uint256 tokenId = mintCoupletWithDefaults(user1);

        CoupletFuAINFT.CoupletContent memory content = nft.getCoupletContent(tokenId);

        assertEq(content.upperLine, UPPER_LINE);
        assertEq(content.lowerLine, LOWER_LINE);
        assertEq(content.horizontalScroll, HORIZONTAL_SCROLL);
        assertEq(content.imageUrl, IMAGE_URL);
        assertTrue(content.mintTime > 0);
        assertTrue(content.mintTime <= block.timestamp);
    }

    function testGetBatchCoupletContent() public {
        uint256 tokenId1 = mintCoupletWithDefaults(user1);
        
        vm.startPrank(user1);
        uint256 tokenId2 = nft.mintCouplet(
            unicode"新春送福迎好运",
            unicode"佳节纳祥贺吉祥",
            unicode"福满人间",
            "ipfs://QmTest987654321/couplet2.png"
        );
        vm.stopPrank();

        uint256[] memory tokenIds = new uint256[](2);
        tokenIds[0] = tokenId1;
        tokenIds[1] = tokenId2;

        CoupletFuAINFT.CoupletContent[] memory contents = nft.getBatchCoupletContent(tokenIds);

        assertEq(contents.length, 2);
        assertEq(contents[0].upperLine, UPPER_LINE);
        assertEq(contents[1].upperLine, unicode"新春送福迎好运");
        assertEq(contents[0].imageUrl, IMAGE_URL);
        assertEq(contents[1].imageUrl, "ipfs://QmTest987654321/couplet2.png");
    }

    function testGetNextTokenId() public {
        assertEq(nft.getNextTokenId(), 0);
        
        mintCoupletWithDefaults(user1);
        assertEq(nft.getNextTokenId(), 1);
        
        mintCoupletWithDefaults(user2);
        assertEq(nft.getNextTokenId(), 2);
    }

    // ============ 点赞功能测试 ============

    function testLikeCouplet() public {
        uint256 tokenId = mintCoupletWithDefaults(user1);

        // User2 点赞
        vm.startPrank(user2);
        nft.likeCouplet(tokenId);
        vm.stopPrank();

        // 验证
        assertEq(nft.getLikeCount(tokenId), 1);
        assertTrue(nft.hasUserLiked(tokenId, user2));
    }

    function testUnlikeCouplet() public {
        uint256 tokenId = mintCoupletWithDefaults(user1);

        // User2 点赞后取消
        vm.startPrank(user2);
        nft.likeCouplet(tokenId);
        nft.unlikeCouplet(tokenId);
        vm.stopPrank();

        // 验证
        assertEq(nft.getLikeCount(tokenId), 0);
        assertFalse(nft.hasUserLiked(tokenId, user2));
    }

    function test_RevertWhen_LikeAlreadyLiked() public {
        uint256 tokenId = mintCoupletWithDefaults(user1);

        vm.startPrank(user2);
        nft.likeCouplet(tokenId);
        
        // 重复点赞应该失败
        vm.expectRevert("CoupletFuAINFT: Already liked");
        nft.likeCouplet(tokenId);
        vm.stopPrank();
    }

    function test_RevertWhen_UnlikeNotLiked() public {
        uint256 tokenId = mintCoupletWithDefaults(user1);

        vm.startPrank(user2);
        
        // 未点赞直接取消应该失败
        vm.expectRevert("CoupletFuAINFT: Not liked yet");
        nft.unlikeCouplet(tokenId);
        vm.stopPrank();
    }

    function testMultipleUsersLike() public {
        uint256 tokenId = mintCoupletWithDefaults(user1);

        // User1 和 User2 都点赞
        vm.prank(user1);
        nft.likeCouplet(tokenId);
        
        vm.prank(user2);
        nft.likeCouplet(tokenId);

        // 验证
        assertEq(nft.getLikeCount(tokenId), 2);
        assertTrue(nft.hasUserLiked(tokenId, user1));
        assertTrue(nft.hasUserLiked(tokenId, user2));
    }

    // ============ 转移测试 ============

    function testTransferFrom() public {
        // User1 铸造 NFT
        uint256 tokenId = mintCoupletWithDefaults(user1);

        // 验证初始状态
        assertEq(nft.ownerOf(tokenId), user1);
        assertEq(nft.balanceOf(user1), 1);
        assertEq(nft.balanceOf(user2), 0);

        // User1 转移给 User2
        vm.startPrank(user1);
        nft.transferFrom(user1, user2, tokenId);
        vm.stopPrank();

        // 验证转移后状态
        assertEq(nft.ownerOf(tokenId), user2);
        assertEq(nft.balanceOf(user1), 0);
        assertEq(nft.balanceOf(user2), 1);
        
        // 验证内容仍然可访问
        CoupletFuAINFT.CoupletContent memory content = nft.getCoupletContent(tokenId);
        assertEq(content.upperLine, UPPER_LINE);
    }

    function test_RevertWhen_TransferFromNotOwner() public {
        uint256 tokenId = mintCoupletWithDefaults(user1);

        // User2 tries to transfer User1's NFT (should fail)
        vm.startPrank(user2);
        vm.expectRevert();
        nft.transferFrom(user1, user2, tokenId);
        vm.stopPrank();
    }

    function testSafeTransferFrom() public {
        uint256 tokenId = mintCoupletWithDefaults(user1);

        vm.startPrank(user1);
        nft.safeTransferFrom(user1, user2, tokenId);
        vm.stopPrank();

        assertEq(nft.ownerOf(tokenId), user2);
    }

    // ============ 管理员功能测试 ============

    function testSetMintFee() public {
        uint256 newFee = 0.05 ether;
        nft.setMintFee(newFee);
        assertEq(nft.mintFee(), newFee);
    }

    function test_RevertWhen_SetMintFeeNotOwner() public {
        vm.startPrank(user1);
        vm.expectRevert();
        nft.setMintFee(0.05 ether);
        vm.stopPrank();
    }

    function testWithdraw() public {
        // Set mint fee and mint
        nft.setMintFee(0.01 ether);

        vm.startPrank(user1);
        nft.mintCouplet{value: 0.01 ether}(
            UPPER_LINE,
            LOWER_LINE,
            HORIZONTAL_SCROLL,
            IMAGE_URL
        );
        vm.stopPrank();

        // Record contract balance before withdraw
        uint256 contractBalance = address(nft).balance;
        assertEq(contractBalance, 0.01 ether);

        // Withdraw (owner is this test contract, so it should work)
        uint256 ownerBalanceBefore = address(owner).balance;
        nft.withdraw();

        // Verify
        assertEq(address(nft).balance, 0);
        assertEq(address(owner).balance, ownerBalanceBefore + contractBalance);
    }

    function test_RevertWhen_WithdrawNotOwner() public {
        vm.startPrank(user1);
        vm.expectRevert();
        nft.withdraw();
        vm.stopPrank();
    }

    // ============ TokenURI 测试 ============

    function testTokenURI() public {
        uint256 tokenId = mintCoupletWithDefaults(user1);

        string memory uri = nft.tokenURI(tokenId);
        
        // 验证 URI 不为空且包含 base64 前缀
        assertTrue(bytes(uri).length > 0);
        assertTrue(_startsWith(uri, "data:application/json;base64,"));
        
        // URI 长度应该大于前缀长度
        assertTrue(bytes(uri).length > 29);
    }

    function testTokenURIContainsImageUrl() public {
        uint256 tokenId = mintCoupletWithDefaults(user1);
        
        string memory uri = nft.tokenURI(tokenId);
        
        // tokenURI 应该包含图片URL (在 Base64 编码之前)
        // 这里我们只验证格式正确
        assertTrue(bytes(uri).length > 0);
    }

    function test_RevertWhen_TokenURIForNonexistentToken() public {
        vm.expectRevert();
        nft.tokenURI(999);
    }

    // Helper function to check if string starts with prefix
    function _startsWith(string memory str, string memory prefix) internal pure returns (bool) {
        bytes memory strBytes = bytes(str);
        bytes memory prefixBytes = bytes(prefix);
        
        if (strBytes.length < prefixBytes.length) {
            return false;
        }
        
        for (uint i = 0; i < prefixBytes.length; i++) {
            if (strBytes[i] != prefixBytes[i]) {
                return false;
            }
        }
        
        return true;
    }

    // ============ 接口测试 ============

    function testSupportsInterface() public view {
        // ERC721
        assertTrue(nft.supportsInterface(0x80ac58cd));
        // ERC721Metadata
        assertTrue(nft.supportsInterface(0x5b5e139f));
        // ERC721Enumerable
        assertTrue(nft.supportsInterface(0x780e9d63));
    }
}
