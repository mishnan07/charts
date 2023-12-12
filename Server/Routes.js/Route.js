import express from 'express';
import { count, countryData, cyclic, getData, region, regionAndTopic, table } from '../Controller/energyController.js';

const route = express.Router()

route.get('/getData',getData)
route.get('/countryData',countryData)
route.get('/regionAndTopic',regionAndTopic)
route.get('/table',table)
route.get('/cyclic',cyclic)
route.get('/region',region)
route.get('/count',count)

export default route;