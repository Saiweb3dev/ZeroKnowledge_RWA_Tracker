// This file is MIT Licensed.
//
// Copyright 2017 Christian Reitwiessner
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
pragma solidity ^0.8.0;
library Pairing {
    struct G1Point {
        uint X;
        uint Y;
    }
    // Encoding of field elements is: X[0] * z + X[1]
    struct G2Point {
        uint[2] X;
        uint[2] Y;
    }
    /// @return the generator of G1
    function P1() pure internal returns (G1Point memory) {
        return G1Point(1, 2);
    }
    /// @return the generator of G2
    function P2() pure internal returns (G2Point memory) {
        return G2Point(
            [10857046999023057135944570762232829481370756359578518086990519993285655852781,
             11559732032986387107991004021392285783925812861821192530917403151452391805634],
            [8495653923123431417604973247489272438418190587263600148770280649306958101930,
             4082367875863433681332203403145435568316851327593401208105741076214120093531]
        );
    }
    /// @return the negation of p, i.e. p.addition(p.negate()) should be zero.
    function negate(G1Point memory p) pure internal returns (G1Point memory) {
        // The prime q in the base field F_q for G1
        uint q = 21888242871839275222246405745257275088696311157297823662689037894645226208583;
        if (p.X == 0 && p.Y == 0)
            return G1Point(0, 0);
        return G1Point(p.X, q - (p.Y % q));
    }
    /// @return r the sum of two points of G1
    function addition(G1Point memory p1, G1Point memory p2) internal view returns (G1Point memory r) {
        uint[4] memory input;
        input[0] = p1.X;
        input[1] = p1.Y;
        input[2] = p2.X;
        input[3] = p2.Y;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 6, input, 0xc0, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require(success);
    }


    /// @return r the product of a point on G1 and a scalar, i.e.
    /// p == p.scalar_mul(1) and p.addition(p) == p.scalar_mul(2) for all points p.
    function scalar_mul(G1Point memory p, uint s) internal view returns (G1Point memory r) {
        uint[3] memory input;
        input[0] = p.X;
        input[1] = p.Y;
        input[2] = s;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 7, input, 0x80, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require (success);
    }
    /// @return the result of computing the pairing check
    /// e(p1[0], p2[0]) *  .... * e(p1[n], p2[n]) == 1
    /// For example pairing([P1(), P1().negate()], [P2(), P2()]) should
    /// return true.
    function pairing(G1Point[] memory p1, G2Point[] memory p2) internal view returns (bool) {
        require(p1.length == p2.length);
        uint elements = p1.length;
        uint inputSize = elements * 6;
        uint[] memory input = new uint[](inputSize);
        for (uint i = 0; i < elements; i++)
        {
            input[i * 6 + 0] = p1[i].X;
            input[i * 6 + 1] = p1[i].Y;
            input[i * 6 + 2] = p2[i].X[1];
            input[i * 6 + 3] = p2[i].X[0];
            input[i * 6 + 4] = p2[i].Y[1];
            input[i * 6 + 5] = p2[i].Y[0];
        }
        uint[1] memory out;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 8, add(input, 0x20), mul(inputSize, 0x20), out, 0x20)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require(success);
        return out[0] != 0;
    }
    /// Convenience method for a pairing check for two pairs.
    function pairingProd2(G1Point memory a1, G2Point memory a2, G1Point memory b1, G2Point memory b2) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](2);
        G2Point[] memory p2 = new G2Point[](2);
        p1[0] = a1;
        p1[1] = b1;
        p2[0] = a2;
        p2[1] = b2;
        return pairing(p1, p2);
    }
    /// Convenience method for a pairing check for three pairs.
    function pairingProd3(
            G1Point memory a1, G2Point memory a2,
            G1Point memory b1, G2Point memory b2,
            G1Point memory c1, G2Point memory c2
    ) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](3);
        G2Point[] memory p2 = new G2Point[](3);
        p1[0] = a1;
        p1[1] = b1;
        p1[2] = c1;
        p2[0] = a2;
        p2[1] = b2;
        p2[2] = c2;
        return pairing(p1, p2);
    }
    /// Convenience method for a pairing check for four pairs.
    function pairingProd4(
            G1Point memory a1, G2Point memory a2,
            G1Point memory b1, G2Point memory b2,
            G1Point memory c1, G2Point memory c2,
            G1Point memory d1, G2Point memory d2
    ) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](4);
        G2Point[] memory p2 = new G2Point[](4);
        p1[0] = a1;
        p1[1] = b1;
        p1[2] = c1;
        p1[3] = d1;
        p2[0] = a2;
        p2[1] = b2;
        p2[2] = c2;
        p2[3] = d2;
        return pairing(p1, p2);
    }
}

contract Verifier {
    using Pairing for *;
    struct VerifyingKey {
        Pairing.G1Point alpha;
        Pairing.G2Point beta;
        Pairing.G2Point gamma;
        Pairing.G2Point delta;
        Pairing.G1Point[] gamma_abc;
    }
    struct Proof {
        Pairing.G1Point a;
        Pairing.G2Point b;
        Pairing.G1Point c;
    }
    function verifyingKey() pure internal returns (VerifyingKey memory vk) {
        vk.alpha = Pairing.G1Point(uint256(0x03231ee982f50a792a35b5cb9c318055f76b5237626a5902d6a4318bfd98b843), uint256(0x0b2bb88d012601703540f9b053e67abffc6032ec5d9991885423b84a28d98594));
        vk.beta = Pairing.G2Point([uint256(0x180b793a30efcbc4f03e65ac1168b49e222ce238e4af73e885d291d540809367), uint256(0x239daf02d5eb6008bf02aa1fd3b6637a87ebfc6bc76117bb35805561ab011f2f)], [uint256(0x180cd8bef1861c2c5ebef8c561e0f2351b46eec970dc69dfe89ee2bb38280f1f), uint256(0x019bdb89d070e003e46aeacc69b866a05df1b6f9b7640f88457428561b63fad0)]);
        vk.gamma = Pairing.G2Point([uint256(0x25b3bc1bfd8d325fc994b3a2eb88315797b0a5f9884129eb38da9d89e4ed9a4e), uint256(0x1b5738ecef27e28bbe2080ce1fd673742db3532e1339613a026e588f98ffe137)], [uint256(0x1357a007c3ae5e696d1b7230d2f0eccc0155d30c54da76216e02ee659b90e96e), uint256(0x0c390bff4c2c0d7f4aab903cc4c4135ad576c61d829387a586749cdafd5568a2)]);
        vk.delta = Pairing.G2Point([uint256(0x09ce291cd8512bf3064a261e532d644f8c8f310910bebed0cf4f9b6374657f2a), uint256(0x0dadc6d1a458ffcf9df0c9a184843cf53f50a643ebec553690e12e0e72688ee4)], [uint256(0x017c6a5994ed3a3e3b8baab19d262b1b13e79b6bcf4e93615101cc2798d5b6e8), uint256(0x03c6c247a6508c0bc90e4ad54f35c9db8bfd431135ebcb174413b22945e9438e)]);
        vk.gamma_abc = new Pairing.G1Point[](46);
        vk.gamma_abc[0] = Pairing.G1Point(uint256(0x2a4a09a7035ee03bcbe26c810467c8c611e03f4bca71e130868205e1fb29bca7), uint256(0x170a646573ba1537f25da7c18153814fba704bb198feb9bc1be4f92ef7af6095));
        vk.gamma_abc[1] = Pairing.G1Point(uint256(0x0e11898c994093409280a99188042bc1922da439d8819154d6b87c8851abc7b6), uint256(0x12824ac26992e0a7d416ffa50d97f275d9b2f170f38b8cac79acc1859b5cd0f7));
        vk.gamma_abc[2] = Pairing.G1Point(uint256(0x07a52bcccace6b73e8fe9d8a290693a9246f55d9dbf18d48c421de5dbd0ef79d), uint256(0x2ae10db8b292f019f1e1b468866c6388e486bccbaf26297339f14111793c6e3c));
        vk.gamma_abc[3] = Pairing.G1Point(uint256(0x08b90c29e82398239929cbd4468b8300aa6bb87a45338221a26b2f4473884e2d), uint256(0x29c9671f3352c921ee38a66bdcdfaff7a63ac19452c4e365fd7a7a1974d60927));
        vk.gamma_abc[4] = Pairing.G1Point(uint256(0x0d03a03230562233aaec03922e2e9b38b437ebbfad0665b4e8ceb31ec824cc70), uint256(0x1b75585efc7608c5e905b51f39f93cc8d4df54187892e30aeb49fe10b06d8f72));
        vk.gamma_abc[5] = Pairing.G1Point(uint256(0x119ba4b151533c00cf88357252fe7cbbc47d47a137ca42cd817cb194841d4a27), uint256(0x246dabf7ffd6ba0bef17a6711566749961b3a35a4cb884337695c5ed9f3d233e));
        vk.gamma_abc[6] = Pairing.G1Point(uint256(0x18ebb2f5a5d0b27e375136ebf55f6aa62381b7191097dc6eac3a4b0bcc59f6f5), uint256(0x1e7a9af6e1a9ce875dfbf912ff17e9f5c019864d755fa0e7fea61ec5691d422e));
        vk.gamma_abc[7] = Pairing.G1Point(uint256(0x040226f4cc73a587d46fce7d0439e7b60ec02e368a793484c21f6adf5a333bf4), uint256(0x2a4ce6e397cf5321420bf6ffbc0028c509e5d55d5d9dfe213c8c2c3af84183ae));
        vk.gamma_abc[8] = Pairing.G1Point(uint256(0x159c8a4e21e3d65ecc69a8a69db7cd6084db062b0f1c720507ed4c128b5bf732), uint256(0x022fa6dcece81bdb1354d9ee9a9e25b7d9aac32bdfa3605b24e0fe866822c2e7));
        vk.gamma_abc[9] = Pairing.G1Point(uint256(0x142d9ebf39934deb277c4605d6c50bcf0394eb461458a2137cecf3e29fb078c8), uint256(0x1852a36ed189d8e645b3ae5cac6f22babe6944234687f098b5e876fbfb9b24a0));
        vk.gamma_abc[10] = Pairing.G1Point(uint256(0x1494b176b59967f90adf9976f4ab409f604188174a09d82e403c686714b2df48), uint256(0x13b727ae7b9b388154153f0a85728274ce683530772cdc2b9ad22e06461e2884));
        vk.gamma_abc[11] = Pairing.G1Point(uint256(0x1a3aac7142b0210f2e8611b9e70d2768e68a54f3468424ff29c5eb0243f360f9), uint256(0x2ae0d5a52721f0ff068f45ea85e6ae9e8f061044c21a53cccde143b1179eda21));
        vk.gamma_abc[12] = Pairing.G1Point(uint256(0x0725954454146f8e1b8508a59c05dacea72f32f48f5c294581139f46b94281ec), uint256(0x1fb63bbd5819a7e2f3fde09aea51090c54a64e590a517f7ca3e54926bd2e6c3d));
        vk.gamma_abc[13] = Pairing.G1Point(uint256(0x04fb918276e39a539abe2a11690e64b697877f78039cc1d571bc07ed89239d68), uint256(0x0bb077c69a518861552b8988c8e8c6b682e712ba8aff4067494541c9856fd58b));
        vk.gamma_abc[14] = Pairing.G1Point(uint256(0x2e874fd162257f6fd18fcf6fece0c7cdcdd79f3580b0edae16a4c0c5ff2692ca), uint256(0x2bf60fed357d12074f6aedeab65d0e8f0bc59427d3e4c38f219cc95e8572e818));
        vk.gamma_abc[15] = Pairing.G1Point(uint256(0x0a0938501485146da98c2bdaf4516f33040bfca09e7cadad49709b1225916795), uint256(0x20645cb3bfeaff5156dd482ad3dc44a468183e9e22b951f4bf187fa7dccf7a4a));
        vk.gamma_abc[16] = Pairing.G1Point(uint256(0x06b8db792d05c4614abfc0a2726fe850e31ffc22602918cc4b116c49127f7c66), uint256(0x2e0c5e2678d9bf0e85509ed20a0cd3a7fc11157657226b3ea720dd171d3b07ef));
        vk.gamma_abc[17] = Pairing.G1Point(uint256(0x0478494ea28b28ff1d00a083129c58a59144a4564557a337a272272a0c028ef0), uint256(0x13cba074fe28dd581a09f3a0b0dc0b959ed61eda6f5dc0af6bba1b1166bb4127));
        vk.gamma_abc[18] = Pairing.G1Point(uint256(0x27357e9b69cadcc22806e43c1f0422f4d3d76de8f32136f0455f9ee831d0982f), uint256(0x12088d80ab898db02f7fd90fec6edbbe6910d3f33ff37e72e4eb561a36948931));
        vk.gamma_abc[19] = Pairing.G1Point(uint256(0x03118d2bf50ca57c741bab06ad374844b0f4c2c1b41ac5c56e0e9a27cbfa6e71), uint256(0x06b40c204e087edf20f789a34a0d1636facd31ea5e3301e08b4bda2e2435c0ca));
        vk.gamma_abc[20] = Pairing.G1Point(uint256(0x074cf520ad0de178ec6afc400bc1071d3b0056c2f695fddda34aa6634af4d8f2), uint256(0x2b31d5233691395625530dfa1491d1369d7bdf347524a4f34bdf523b0d4b4a66));
        vk.gamma_abc[21] = Pairing.G1Point(uint256(0x164fc605b1c97c49ff7c6e6de9c9685b9707faf581d9999645e03cb5be16934f), uint256(0x22c22d7a242b71c1903bef8e051babbd3b1dd96b44c853958f78dee61e2cf638));
        vk.gamma_abc[22] = Pairing.G1Point(uint256(0x0767aa32d59dc7faddc3fd8978c681423307a1c38fab910a0f4db2cd226e9348), uint256(0x0b9f1eaca635edd8f30b9ff22524d8c7dd02b46e4889d699bc415c00e4b837f4));
        vk.gamma_abc[23] = Pairing.G1Point(uint256(0x2a00cbd0ce3c2dda9d633109f222b2162b7811794ea4845149c14bc08bba3a27), uint256(0x125083659824e6ba607dcaee8dce26477a450c58e95e897f49ecb60359d9f16a));
        vk.gamma_abc[24] = Pairing.G1Point(uint256(0x1a72b103d591ee504eefe2ffbc8fbe46459585a259d2c358b2642a39cd5baf65), uint256(0x028252ecc339119cbc708c28f6d72f16dd7b453e99cedf969bb5ad3080ed6182));
        vk.gamma_abc[25] = Pairing.G1Point(uint256(0x092c26a37014b8fac7927feb1284e56ca9d417bb857497fe2378589d9fbe1f9b), uint256(0x2077bcd1c05f4cfa10a743c4ae43b42c4ff1cdb16446f345a450def6c8ca3a6f));
        vk.gamma_abc[26] = Pairing.G1Point(uint256(0x2088610f2111047e40e758f4d776694219d9c1b7df7cea0e88568a296f025254), uint256(0x15b174dfbe7b0c605d7e0dbf5c2f55c79cc52a9f06f1fc4a064d31bd39fb2466));
        vk.gamma_abc[27] = Pairing.G1Point(uint256(0x15df940a27521fa698c56f67ae7194c595ce68b5c1d00006aaf30e347a62813e), uint256(0x176178c4c88dbea0af322abbdde114b9026b0f4118b2a17f5184fe5c6c3a0f0a));
        vk.gamma_abc[28] = Pairing.G1Point(uint256(0x030be8fa53c2c7f94d5357ef45047ad6e067b1bd97d1cb6853d79234dc7977c0), uint256(0x2b7881485d786dd1d898b953b7d067541d1eab0f3e305578d5f4c041f0ba81bb));
        vk.gamma_abc[29] = Pairing.G1Point(uint256(0x2948365921fc646f54a9f8d5eb7dbded4ba5ddd22da759395f0ba8bdc6e93917), uint256(0x2d1904524181e658e28d66897a12d6c785799b6a0af1aa7825fc0cb1d03a4c9b));
        vk.gamma_abc[30] = Pairing.G1Point(uint256(0x300376cbc1f277f772495d0727cf26950536b89e47c729e8f79738039d281088), uint256(0x0593f8d00d9cf794c0fa0f7b4363b12bf1207126cb0d69d6b356a6b956414993));
        vk.gamma_abc[31] = Pairing.G1Point(uint256(0x273abf328afe54c71db122355b3e1f2de3ab0255e8d0b67098700779270b0f23), uint256(0x14a295fbc716c9d52368af483b400340ed223bf8787f41af125a4cdf1e999cb7));
        vk.gamma_abc[32] = Pairing.G1Point(uint256(0x12386f3f14e76f135f5b23bb15ff732a1dc524807bbe47573e0eaac490aaf105), uint256(0x145fbe7633963ee2fd78b23afb973932ee4bcf445b3bb8f0deebec7086c5cdc5));
        vk.gamma_abc[33] = Pairing.G1Point(uint256(0x00e23838dcd73ba15b8d9ef47a074a7d34704f8e2ec7dafedf6f1352be50b1d7), uint256(0x1caa8c439974533e9f1ac79772d4de3fadd751edb86722e0b04d6deb57a02de2));
        vk.gamma_abc[34] = Pairing.G1Point(uint256(0x041db7bfaa2a1bdd64999ba343d999c32662f07b7c027393f8bbea39cea01fdb), uint256(0x287d1198938489d8d0446e1e23e066d7752d612833b6be70808aa5f4401fc372));
        vk.gamma_abc[35] = Pairing.G1Point(uint256(0x1e9a0e49ac406b814b303bb03161900a327e75d43467ba11c7acc543b9b7b242), uint256(0x12b3bd021454e27d286b7d7d66bdf27c4209b9935f07b72f72a285be354c159c));
        vk.gamma_abc[36] = Pairing.G1Point(uint256(0x0442a730d3a9e6ac56994cb98e4a937e833bc180990d4f29058f0712ebb888a0), uint256(0x21f75ec0d87dd3cfe0eb488a792babf43f910d3d98fbe9e7c8ee20e48a322fcc));
        vk.gamma_abc[37] = Pairing.G1Point(uint256(0x07d9fed69b0d11c0e7d63c149686a56659380ee52012e1407dce3cc9c182635a), uint256(0x251af758d528c7c5413820025bf83e779d2bf2e6a22c15efc87cd41ff0a17145));
        vk.gamma_abc[38] = Pairing.G1Point(uint256(0x1a7f9d055a563bccf1f2cc771cff5eda1967165941d394cf028a973b770ce7b0), uint256(0x23e635675de07162549c70c4657252577884abc5dba6d3474407731f5c6b0f6e));
        vk.gamma_abc[39] = Pairing.G1Point(uint256(0x226bed13e2de86a4b03ee9138c828be927fc9daa4b5206341ad9c6799ea56999), uint256(0x0af10f2aaa92c3bf60370022b8a8319b08089baddd433454623c144d31fe353b));
        vk.gamma_abc[40] = Pairing.G1Point(uint256(0x128b7e132973bd582847580cf5b40bf3e9173b29ba1fa08b4626907452dfd659), uint256(0x1d5bc601f03e0ac1c6e68f0a7b136c8ebb96a87899d43a0b9fc2d17f60df50ff));
        vk.gamma_abc[41] = Pairing.G1Point(uint256(0x2d93654a69bb932c952c8c8360795dfbd9e08e8e832c31345d5352658b0f681e), uint256(0x30148f89fdc9eadcca922d6ccff63b51a1262b24ba66aa3b82bfaf377f7731a1));
        vk.gamma_abc[42] = Pairing.G1Point(uint256(0x0f28b1ad9465cf339db706f3146f701843fedb92ae7df9343a79183684fa3953), uint256(0x2246284735319d4c352b0fd4dfb7e4d5df27632e10f50d39509728f49c866e1f));
        vk.gamma_abc[43] = Pairing.G1Point(uint256(0x153e1d213d12ad6a503ec7ddcccd3bc55e2cfe7c0d1ef2a140078ab9e0d2611f), uint256(0x1a4c54cc50897f2256f6866b6bdd81c1e911c35bf6e1d12fff2390a58fda4e5d));
        vk.gamma_abc[44] = Pairing.G1Point(uint256(0x0ae295a4d8a84c902dd1cfa5cf008fd9b5042d781b0c8259a766572c679d5f91), uint256(0x2994973003d87ebb28776c812843590a092aae68a4de051b74a71cc3767fda11));
        vk.gamma_abc[45] = Pairing.G1Point(uint256(0x2e600e7a68ef9a8378b35a2431b199ba44103c1ffdd5ffa18ca41ac3c440f120), uint256(0x009eba511d808bc1797ffd5eb4476813cddc11946becbcaca9533ad63e0f9852));
    }
    function verify(uint[] memory input, Proof memory proof) internal view returns (uint) {
        uint256 snark_scalar_field = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
        VerifyingKey memory vk = verifyingKey();
        require(input.length + 1 == vk.gamma_abc.length);
        // Compute the linear combination vk_x
        Pairing.G1Point memory vk_x = Pairing.G1Point(0, 0);
        for (uint i = 0; i < input.length; i++) {
            require(input[i] < snark_scalar_field);
            vk_x = Pairing.addition(vk_x, Pairing.scalar_mul(vk.gamma_abc[i + 1], input[i]));
        }
        vk_x = Pairing.addition(vk_x, vk.gamma_abc[0]);
        if(!Pairing.pairingProd4(
             proof.a, proof.b,
             Pairing.negate(vk_x), vk.gamma,
             Pairing.negate(proof.c), vk.delta,
             Pairing.negate(vk.alpha), vk.beta)) return 1;
        return 0;
    }
    function verifyTx(
            Proof memory proof, uint[45] memory input
        ) public view returns (bool r) {
        uint[] memory inputValues = new uint[](45);
        
        for(uint i = 0; i < input.length; i++){
            inputValues[i] = input[i];
        }
        if (verify(inputValues, proof) == 0) {
            return true;
        } else {
            return false;
        }
    }
}
