const { expect } = require("chai");

describe("SignatureReg", function() {
  it("should register its own 'register' method signature", async () => {
    const SignatureReg = await ethers.getContractFactory("SignatureReg");
    const signatureReg = await SignatureReg.deploy();

    const method = "register(string)";
    const encodedFnSig = web3.eth.abi.encodeFunctionSignature(method);

    expect(await signatureReg.entries(encodedFnSig)).to.equal(method);
  });

  it("should allow registering a method signature", async () => {
    const SignatureReg = await ethers.getContractFactory("SignatureReg");
    const signatureReg = await SignatureReg.deploy();

    const method = "hello_world(uint256,string,bool)";
    await signatureReg.register(method);
    const encodedFnSig = web3.eth.abi.encodeFunctionSignature(method);

    expect(await signatureReg.entries(encodedFnSig)).to.equal(method);
    expect(await signatureReg.totalSignatures()).to.equal(2);
  });

  it("should only allow new registrations", async () => {
    const SignatureReg = await ethers.getContractFactory("SignatureReg");
    const signatureReg = await SignatureReg.deploy();

    const method = "register(string)";

    // Trying to register an existing method
    const reg = await signatureReg.register(method)
    const receipt = await reg.wait();

    // No register events should be emitted
    expect(receipt.events.length).to.equal(0);
    // The number of registered signatures should not increase
    expect(await signatureReg.totalSignatures()).to.equal(1);
  });
});
