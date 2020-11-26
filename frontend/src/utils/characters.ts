import mario from '../assets/mario.png';
import luigi from '../assets/luigi.png';
import dk from '../assets/dk.png';
import link from '../assets/link.png';
import samus from '../assets/samus.png';
import yoshi from '../assets/yoshi.png';
import kirby from '../assets/kirby.png';
import fox from '../assets/fox.png';
import pikachu from '../assets/pikachu.png';
import puff from '../assets/puff.png';
import falcon from '../assets/falcon.png';
import ness from '../assets/ness.png';
import peach from '../assets/peach.png';
import bowser from '../assets/bowser.png';
import drmario from '../assets/dr_mario.png';
import zelda from '../assets/zelda.png';
import sheik from '../assets/sheik.png';
import yl from '../assets/yl.png';
import ganon from '../assets/ganon.png';
import falco from '../assets/falco.png';
import pichu from '../assets/pichu.png';
import mewtwo from '../assets/mewtwo.png';
import ic from '../assets/ic.png';
import marth from '../assets/marth.png';
import roy from '../assets/roy.png';
import gw from '../assets/g&w.png';

import { PlayableCharacter, Region } from 'types/match';

interface _PlayableCharacter {
    key: string;
    name: PlayableCharacter;
    icon: React.ImgHTMLAttributes<any>['src'];
    id: number;
};

export const playableCharacters: _PlayableCharacter[] = [
    {
        key: 'mario',
        name: 'Mario',
        icon: mario,
        id: 8
    }, 
    {
        key: 'luigi',
        name: 'Luigi',
        icon: luigi,
        id: 7
    }, 
    {
        key: 'dk',
        name: 'Donkey Kong',
        icon: dk,
        id: 1
    }, 
    {
        key: 'link',
        name: 'Link',
        icon: link,
        id: 6
    }, 
    {
        key: 'samus',
        name: 'Samus',
        icon: samus,
        id: 16
    }, 
    {
        key: 'yoshi',
        name: 'Yoshi',
        icon: yoshi,
        id: 17
    }, 
    {
        key: 'kirby',
        name: 'Kirby',
        icon: kirby,
        id: 4
    }, 
    {
        key: 'fox',
        name: 'Fox',
        icon: fox,
        id: 2
    }, 
    {
        key: 'pikachu',
        name: 'Pikachu',
        icon: pikachu,
        id: 13
    }, 
    {
        key: 'puff',
        name: 'Jigglypuff',
        icon: puff,
        id: 15
    }, 
    {
        key: 'falcon',
        name: 'C. Falcon',
        icon: falcon,
        id: 0
    }, 
    {
        key: 'ness',
        name: 'Ness',
        icon: ness,
        id: 11
    }, 
    {
        key: 'peach',
        name: 'Peach',
        icon: peach,
        id: 12
    }, 
    {
        key: 'bowser',
        name: 'Bowser',
        icon: bowser,
        id: 5
    }, 
    {
        key: 'drmario',
        name: 'Dr. Mario',
        icon: drmario,
        id: 22
    }, 
    {
        key: 'zelda',
        name: 'Zelda',
        icon: zelda,
        id: 18
    },
    {
        key: 'sheik',
        name: 'Sheik',
        icon: sheik,
        id: 19
    },  
    {
        key: 'yl',
        name: 'Young Link',
        icon: yl,
        id: 21
    }, 
    {
        key: 'ganon',
        name: 'Ganondorf',
        icon: ganon,
        id: 25
    }, 
    {
        key: 'falco',
        name: 'Falco',
        icon: falco,
        id: 20
    }, 
    {
        key: 'pichu',
        name: 'Pichu',
        icon: pichu,
        id: 24
    }, 
    {
        key: 'mewtwo',
        name: 'Mewtwo',
        icon: mewtwo,
        id: 10
    }, 
    {
        key: 'ic',
        name: 'Ice Climbers',
        icon: ic,
        id: 14
    }, 
    {
        key: 'marth',
        name: 'Marth',
        icon: marth,
        id: 9
    }, 
    {
        key: 'roy',
        name: 'Roy',
        icon: roy,
        id: 23
    }, 
    {
        key: 'gw',
        name: 'G&W',
        icon: gw,
        id: 3
    }, 
    {
        key: 'any',
        name: 'Any',
        icon: gw,
        id: 26
    }, 
];

interface _Region {
    key: string;
    name: Region;
};

export const regions: _Region[] = [
    {
        key: 'europe',
        name: 'Europe'
    },
    {
        key: 'australia',
        name: 'Australia'
    },
    {
        key: 'asia',
        name: 'Asia'
    },
    {
        key: 'sa',
        name: 'South America'
    },
    {
        key: 'na',
        name: 'North America'
    },
    {
        key: 'any',
        name: 'Any'
    }
];
