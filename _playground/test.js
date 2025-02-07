import { loadJson } from 'jnu-abc';

const devRoot = process.env.DEV_ROOT || './config';
const settingFile = devRoot + '/jd-environments/Apis/notion/monblue_0.json';

const setting = loadJson(settingFile);

console.log(setting);
