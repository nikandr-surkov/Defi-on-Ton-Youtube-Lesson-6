import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Address, toNano } from '@ton/core';
import { MapsStructsMessages } from '../wrappers/MapsStructsMessages';
import '@ton/test-utils';

describe('MapsStructsMessages', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let mapsStructsMessages: SandboxContract<MapsStructsMessages>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        mapsStructsMessages = blockchain.openContract(await MapsStructsMessages.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await mapsStructsMessages.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: mapsStructsMessages.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and mapsStructsMessages are ready to use
    });

    it('should set keys correctly', async() => {

        const setResult = await mapsStructsMessages.send(
            deployer.getSender(),
            {
                value: toNano('0.05')
            },
            'set keys'
        );

        expect(setResult.transactions).toHaveTransaction({
            success: true
        });

        const ticker = await mapsStructsMessages.getItemCheck();
        console.log('ticker', ticker);
        expect(ticker).toEqual('durev');

        const address = await mapsStructsMessages.getOneItem(-900n);
        console.log('address', address?.toString());
        expect(address).toEqualAddress(Address.parse("EQB02DJ0cdUD4iQDRbBv4aYG3htePHBRK1tGeRtCnatescK0"));
    });

    it('should delete keys correctly', async() => {

        const setResult = await mapsStructsMessages.send(
            deployer.getSender(),
            {
                value: toNano('0.05')
            },
            'set keys'
        );

        let ticker = await mapsStructsMessages.getItemCheck();
        console.log('ticker before', ticker);

        const deleteResult = await mapsStructsMessages.send(
            deployer.getSender(),
            {
                value: toNano('0.05')
            },
            'delete keys'
        );

        expect(deleteResult.transactions).toHaveTransaction({
            success: true
        });

        ticker = await mapsStructsMessages.getItemCheck();
        console.log('ticker after', ticker); 
        expect(ticker).toEqual('not found');
    });

    it('should clear all maps correctly', async() => {

        const setResult = await mapsStructsMessages.send(
            deployer.getSender(),
            {
                value: toNano('0.05')
            },
            'set keys'
        );

        let allItems = await mapsStructsMessages.getAllItems();
        console.log('all items size before', allItems.size);

        const clearResult = await mapsStructsMessages.send(
            deployer.getSender(),
            {
                value: toNano('0.05')
            },
            'clear'
        );

        expect(clearResult.transactions).toHaveTransaction({
            success: true
        });

        allItems = await mapsStructsMessages.getAllItems();
        console.log('all items size after', allItems.size);
        expect(allItems.size).toBe(0);
    });

});
