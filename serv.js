const express = require("express"); //import express
const fs = require("fs"); //import fs

const PORT = 8888; // define port
const app = express(); // create obj of express

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const methodOverride = require('method-override')
app.use(methodOverride('_method'))

//define the routes
//get
app.get("/", (req, res) => {
  const data = JSON.parse(fs.readFileSync("empdata.json"));
  let empshow = fs.readFileSync("index.txt");

  data.map((item, index) => {
   empshow = empshow + (
     `<tr class="table">
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.age}</td>
        <td>${item.city}</td>
        <td>${item.salary}</td>
        <td>
          <form method="GET" action="/updatedata/${item.id}/${item.name}/${item.age}/${item.city}/${item.salary}">
            <button class="btn btn-warning" type="submit" >Update</button>
          </form>
        </td>
        <td>
          <form method="POST" action="/deletedata/${item.id}?_method=DELETE">
            <button class="btn btn-danger" type="submit">Delete</button>
          </form>
        </td>
      </tr>`
    );
  });
  empshow=empshow+(`</tbody></table></div><br/></div></body></html>`)
  res.send(empshow);
});

//get
app.get("/add-data", (req, res) => {
  res.sendFile("form.html", { root: "." });
});

//add - employee
app.post("/add-data-post", (req, res) => {
  console.log(req.body);
  const empdata = JSON.parse(fs.readFileSync("empdata.json"));
  let datapush = req.body;
  const len = empdata.length
  datapush["id"]= len + 1
  empdata.push(datapush);
  fs.writeFileSync("empdata.json", JSON.stringify(empdata));
  //res.send(`Name: ${req.body.name} , Age : ${req.body.age} , City: ${req.body.city} , Salary: ${req.body.salary}`);
  //res.send( `<h2>Data Submitted</h2> <br/> <a  class="btn btn-primary" href="/">Go Home</a>`);
  res.send('<script>window.location.href="/";</script>');
});

//delete - data
app.delete('/deletedata/:id', (req, res) => {
    const id=req.params.id
    const data=JSON.parse(fs.readFileSync('empdata.json'))
    data.splice(id-1,1)
    console.log(data)
    fs.writeFileSync('empdata.json',JSON.stringify(data))
    res.send('<script>window.location.href="/";</script>');
})

//update - get
app.get('/updatedata/:id/:name/:age/:city/:salary',(req,res)=>{
  var data =fs.readFileSync('update-form.html').toString()
  const id=req.params.id
  const name=req.params.name
  const age=req.params.age
  const city=req.params.city
  const salary=req.params.salary
  console.log(id)
  data=data.replace('${item.id}',id)
  data=data.replace('upname',name)
  data=data.replace('upage',age)
  data=data.replace('upcity',city)
  data=data.replace('upsalary',salary)
  console.log(data)
  res.send(data)
  res.send('<script>window.location.href="/";</script>');
})

//update - put
app.put('/updatedata/:id', (req, res) => {
  const id=req.params.id
  var data=JSON.parse(fs.readFileSync('empdata.json'))
  var updata=(req.body)
  data.map(item=>{
    if(item.id==id){
      item.id=id
      item.name=updata.name
      item.age=updata.age
      item.city=updata.city
      item.salary=updata.salary
    }
  })
  fs.writeFileSync('empdata.json',JSON.stringify(data))
  // res.send(`<h1>Data Updated</h1> <br/><a  class="btn btn-primary" href="/">Go Home</a>`)
  res.send('<script>window.location.href="/";</script>');
})

//define app in the port
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`work on ${PORT}`);
})