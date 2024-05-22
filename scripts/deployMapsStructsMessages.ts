import { toNano } from '@ton/core';
import { MapsStructsMessages } from '../wrappers/MapsStructsMessages';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const mapsStructsMessages = provider.open(await MapsStructsMessages.fromInit());

    await mapsStructsMessages.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(mapsStructsMessages.address);

    // run methods on `mapsStructsMessages`
}
