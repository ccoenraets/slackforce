"use strict";

exports.handle = (req, res) => {
    console.log(req.body);
    res.json({text: "Go it"});
}
