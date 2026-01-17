// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/CoupletFuAINFT.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying CoupletFuAINFT contract...");
        console.log("Deployer address:", deployer);

        vm.startBroadcast(deployerPrivateKey);

        // 部署合约
        CoupletFuAINFT nft = new CoupletFuAINFT(deployer);

        vm.stopBroadcast();

        console.log("CoupletFuAINFT deployed at:", address(nft));
        console.log("Contract owner:", nft.owner());
        console.log("Initial mint fee:", nft.mintFee());
        console.log("\nDeployment successful!");
        
        // 输出配置信息用于前端
        console.log("\n=== Frontend Configuration ===");
        console.log("Contract Address:", address(nft));
        console.log("Network: Check your RPC URL");
    }
}
