import Koa from "koa"
import axios from "axios"
const app = new Koa();


app.use(async(ctx,next)=>{
  await next()
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

app.use(async(ctx,next)=>{
  if(ctx.url.includes("api/auth/redirect")){
    console.log(ctx.query.code)
    const requestToken = ctx.query.code
    const clientID = "99c381a359805c64a86c"
    const clientSecret = "1aa6aac36288328282633755952fa0796290bfbf"
    const tokenResponse = await axios({
      method: 'post',
      url: 'https://github.com/login/oauth/access_token?' +
        `client_id=${clientID}&` +
        `client_secret=${clientSecret}&` +
        `code=${requestToken}`,
      headers: {
        accept: 'application/json'
      }
    });          
    console.log(tokenResponse.data)

    const result = await axios({
      method: 'get',
      url: `https://api.github.com/user`,
      headers: {
        accept: 'application/json',
        Authorization: `token ${tokenResponse.data.access_token}`
      }
    });
    console.log(result.data)
    let queryStr = ""
    for(let i in result.data){
      queryStr += `&${i}=${result.data[i]}`
    }
    ctx.redirect(`http://localhost:3002/index?${queryStr}`)
  }
  await next()
})

app.listen(3001,()=>{
  console.log("server listening on 3001")
});