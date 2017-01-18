import { Cd } from '../cd';
import { Song } from '../song';
import { propChanged, addItem, rmvItem, setItems, init, title, validate } from '../../../../src/index';


export class CdRules {
    @propChanged(Song, 'cd')
    static async afterCdChanged(song: Song, eventInfo: any): Promise<void> {
        await song.cdChangedHits.setValue(song.cdChangedHits.value + 1);
    }
    @propChanged(Song, 'duration')
    static async afterDurationChanged(song: Song, eventInfo: any, newValue: number, oldValue: number): Promise<void> {
        let cd = await song.cd();
        if (cd)
            await cd.duration.setValue(cd.duration.value - oldValue + newValue);
    }

    @addItem(Cd, 'songs')
    static async afterAddItem(cd: Cd, eventInfo: any, song: Song): Promise<void> {
        await cd.duration.setValue(cd.duration.value + song.duration.value);
    }
    @rmvItem(Cd, 'songs')
    static async afterRmvItem(cd: Cd, eventInfo: any, song: Song): Promise<void> {
        await cd.duration.setValue(cd.duration.value - song.duration.value);
    }
}

export var test = 1;