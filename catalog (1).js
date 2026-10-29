import {catalogueForPublic} from '../../_lib/catalog.js';
import {json} from '../../_lib/http.js';
export function onRequestGet({env}){return json({ok:true,...catalogueForPublic(env)});}
