const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedback')


router.get('/',  async (req, res) =>{
    console.log("GET api/user/")
    try {
        const users = await Feedback.find();
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json("Forbidden")
    }
})

router.post('/', function(req, res){
    try {
        const {predictedLabel, trueLabel, success, videoID} = req.body;
        const newFeedback = new Feedback({predictedLabel:predictedLabel, trueLabel: trueLabel, videoID: videoID, success: success})
        newFeedback.save(function(err){
            if(err) {
                console.log(err);
                res.status(500).send("An error occured while saving this feedback");
            }
        })
        res.status(200);
    } catch (error) {
        res.status(500)
    }
    
})

module.exports = router;
