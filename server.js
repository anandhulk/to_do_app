var express=require('express')
var mongoClient=require('mongodb').MongoClient
var {ObjectId} = require('mongodb')


let app=express()
let db
async function start(){
    let client=new mongoClient('mongodb+srv://anandhu:G3tgE6g8GSNRpQc5@nodeexpressproject.ppwhgzx.mongodb.net/?retryWrites=true&w=majority')
    await client.connect()
    db=client.db()
    console.log("connected to db..")
    app.listen(3000)
}
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.get("/",async function(req,res){

    let items=await db.collection('tasks').find().toArray()
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple To-Do App</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">To-Do App</h1>
        
        <div class="jumbotron p-3 shadow-sm">
          <form action="/add-item" method="POST">
            <div class="d-flex align-items-center">
              <input name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div>
        
        <ul class="list-group pb-5">
          ${items.map((item)=>{
              return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
              <span class="item-text">${item.item}</span>
              <div>
                <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
                <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
              </div>
            </li>`
          }).join('')}
        </ul>
        
      </div>
    <script src="https://unpkg.com/axios@1.1.2/dist/axios.min.js"></script>
    <script src="/browser.js"></script>
    </body>
    </html>
    `)
})

app.post("/add-item",async (req,res)=>{
    await db.collection('tasks').insertOne({item:req.body.item})
    res.redirect("/")
})

app.post("/edit-task",async(req,res)=>{
  try {
    console.log(req.body)
    let id=new ObjectId(req.body.id)
    await db.collection('tasks').findOneAndUpdate({_id:id},{$set:{item:req.body.item}})
    res.redirect("/")
  } catch (error) {
    console.log(error)
  }
    
})

app.post("/delete-task",async(req,res)=>{
  try {
    let id=new ObjectId(req.body.id)
    await db.collection('tasks').findOneAndDelete({_id:id})
    res.redirect("/")
  } catch (error) {
    console.log(err)
  }
})

start()