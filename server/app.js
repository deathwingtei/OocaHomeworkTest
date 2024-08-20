const express = require('express');
const cors = require("cors");
const shopRoutes = require("./routes/shop");

const app = express();

// middleware
app.use(cors({
    origin: true
}));
app.use(express.urlencoded({extended:true})); //endcode for post data
app.use(express.json());

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

// route

app.get("/",(req,res)=>{
    res.json({
        data:"404",
    });
});
app.use('/shop', shopRoutes);

// Start the server only if this file is executed directly
if (require.main === module) {
    const port = 1243;
    app.listen(port, () => console.log(`Server running on port ${port}`));
}

module.exports = app;