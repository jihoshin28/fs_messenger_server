const Chat = require('../models/chat')
const User = require('../models/user')

const getChats = async(req, res) => {
    const chats = await Chat.find({}, (err, users) => {
        if(err) {
            res.send(err).status(500)
        }
        res.json(chats).status(200)
    })
}

const getChat = async(req, res) => {
    const chat = await Chat.find({_id: req.params.id }).populate('messages').exec((err, chat) => {
        if(err){
            res.send(err).status(500)
        }
        res.json({chat}).status(200)
    })
}

const createChat = (req, res) => {
    console.log(req.body.user_ids)
    try{
        res.header('Content-Type', 'application/json')
        const newChat = new Chat({
            users: req.body.user_ids,
            messages: []
        })
        newChat.save((err) => {
            if(err) throw err
        }) 
        res.json({newChat}).status(200)
    } catch(error){
        res.send(error.message).status(500)
    }
}

const addUserToChat = async(req, res) => {
    try{
        const chat = Chat.find({_id: req.params.id})
        chat.users = [...chat.users, req.body.user_id]
        chat.save((err) => {
            if(err) throw err
        }) 
        res.send(`Added user with user id ${req.body.user_id} to chat`).status(200)
    } catch(error){
        res.send(error.message).status(500)
    }
}

const removeUserFromChat = async(req, res) => {
    try{
        const chat = Chat.find({_id: req.params.id})
        chat.users = chat.users.filter((user_id) => user_id !== req.body.user_id)
        chat.save((err) => {
            if(err) throw err
        }) 
        res.send(`Removed user with user id ${req.body.user_id} from chat.`).status(200)
    } catch(error){
        res.send(error.message).status(500)
    }
}

const deleteChat = async(req, res) => {
    try{
        Chat.delete({_id: req.params.id})
        res.send(`Deleted chat with id ${req.params.id}`).status(200)
    } catch(error){
        res.send(error.message).status(500)
    }
}

module.exports = {
    getChats,
    getChat,
    createChat,
    addUserToChat,
    removeUserFromChat,
    deleteChat
}

