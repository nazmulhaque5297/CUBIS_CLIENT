import { baseUrl } from './config'


function createUrl(subUrl){
  return baseUrl+subUrl;
}

export { createUrl }
