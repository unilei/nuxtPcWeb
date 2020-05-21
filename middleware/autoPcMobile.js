import base from '../api/base'
const axios = require('axios')

export default function ({isServer,req,redirect,route}) {


  // let pcOrigin = 'https://s.171tiyu.com'
  let pcOrigin = 'https://www.171tiyu.com'
  // let pcOrigin = 'http://localhost:3000'
  // let mobileOrigin = 'https://sm.171tiyu.com'
  let mobileOrigin = 'https://m.171tiyu.com'
  // let mobileOrigin = 'http://localhost:3001'

  // console.log(route.fullPath)
  let old_route_fullPath = route.fullPath;
  let fullPathArr = old_route_fullPath.split('/')
  if (fullPathArr[1] === 'article' || fullPathArr[1] === 'news'){
    let s = fullPathArr[2];
    let sArr = s.split('-');
    let redirect_url = pcOrigin+'/nsnews/'+sArr[0]+'/'+s;
    return redirect(301,redirect_url)
  }

  if (old_route_fullPath === '/protocol' ){
    let redirect_url = pcOrigin+'/profile/agreement'
    return redirect(301,redirect_url)
  }
  if (old_route_fullPath === '/privacy'){
    let redirect_url = pcOrigin+'/profile/privacy'
    return redirect(301,redirect_url)
  }
  if (old_route_fullPath === '/complaint'){
    let redirect_url = pcOrigin+'/profile/complaint'
    return redirect(301,redirect_url)
  }

  if (old_route_fullPath === '/app'){
    let redirect_url = pcOrigin+'/download'
    return redirect(301,redirect_url)
  }


  // 旧链接跳转
  let old_route_name = route.name;

  if (old_route_name === 'sportNews-detail-shorturl'){

    let old_params = route.params.shorturl;
    let sArr = old_params.split('-');
    let redirect_url = pcOrigin+'/nsnews/'+sArr[0]+'/'+old_params;

    return redirect(301,redirect_url);
  }
  if (old_route_name === 'sportNews-list-league'){
    return redirect(301,pcOrigin+'/nsnews/all')
  }
  if (old_route_name === 'bbs-list-sportType'){
    return redirect(301,pcOrigin+'/nsforum/football')
  }
  if (old_route_name === 'bbs-detail-articleId'){
    let article_id = route.params.articleId;
    axios.get(`${base.sq}/v1/forum/` + article_id).then(
      res=>{
        if (res.data.Status === 1){
          let category = res.data.Data[0].category;
          let redirect_url = pcOrigin + '/nsforum/'+category+'/'+article_id;
          return redirect(301,redirect_url)
        }
      }
    )

  }

  let isMobile = (ua) => {
    return !!ua.match(/AppleWebKit.*Mobile.*/)
  }

  let userAgent = req ? req.headers['user-agent'] : navigator.userAgent || ''

  return isMobile(userAgent) ? redirect(301,mobileOrigin+route.fullPath) : ''
  // 使用redirect 重定向到外链需要加上前缀:http / https

}
