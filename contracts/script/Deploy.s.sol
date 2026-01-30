// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/GameEvents.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        GameEvents game = new GameEvents();
        console.log("GameEvents deployed at:", address(game));

        vm.stopBroadcast();
    }
}
