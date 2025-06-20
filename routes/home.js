const express = require("express");
const app = express();
const router = express.Router()
const User = require('../models/User')
const Post = require('../models/Post')
const Friends = require('../models/Friends');
const Group = require('../models/Group');
const Members = require('../models/Members');
const { where } = require("sequelize");
const { Op } = require('sequelize');

router.get('/:id', async function(req, res){
    id = req.params.id;
    fid = req.query.friend;
    gid = req.query.group;
    msg = req.query.msg
    msggp = req.query.msggp
    plist = []
    flist = []
    glist = []
    destinationtp = {}

    if(fid)
    {
        destinationtp = {destination: fid, tp: 0}
        posts = await Post.findAll({
            where:{ [Op.or]: [
                { author: id, destination: fid }, 
                { author: fid, destination: id }], destinationtp: 0} 
        })

        if(posts.length > 0)
            {
                plist = await Promise.all(posts.map( async post => ({
                    content: post.content,
                    author: (await User.findOne({
                        where: {id: post.author}
                    })).name,
                    authorid: (await User.findOne({
                        where: {id: post.author}
                    })).id
                })))
            }
    }   
    if(gid)
    {
        destinationtp = {destination: gid, tp: 1}
        posts = await Post.findAll({
            where:{ destination: gid, destinationtp: 1} 
        })

        if(posts.length > 0)
            {
                plist = await Promise.all(posts.map( async post => ({
                    content: post.content,
                    author: (await User.findOne({
                        where: {id: post.author}
                    })).name,
                    authorid: (await User.findOne({
                        where: {id: post.author}
                    })).id
                })))
               
            }
    }

    friends = await Friends.findAll({
        where:{ [Op.or]: [{userID: id}, {friendID: id}], status: 1}
    })

    if(friends.length > 0)
    {
        flist = await Promise.all(friends.map( async friend => ({
            id: friend.userID == id ? friend.friendID : friend.userID,
            name: (await User.findOne({
                where: {id: friend.userID == id ? friend.friendID : friend.userID}
            })).name
        })))
    }

    groups = await Members.findAll({
        where:{memberID: id, status: 1}
    })

    if(groups.length > 0)
    {
        glist = await Promise.all(groups.map( async group => ({
            id: group.memberID,
            gid: group.groupID,
            name: (await Group.findOne({
                where: {id: group.groupID}
            })).name
        })))
    }

    res.render('home', {id, flist, plist, destinationtp, glist, msg, msggp});
})

router.post('/:id/searchfriend', async function(req, res){
    id = req.params.id;
    username = req.body.username;

    if(username.trim() == "")
        {
            msg = "Informe o nome do usuário antes de continuar!"
        }
    else
    {
        user = await User.findOne({
            where: {name: username}
        })
    
        if(user == null)
            {
                msg = "Usuário não encontrado."
            }
        else
        {
            exist = await Friends.findOne({
                where: {userID: id,
                        friendID: user.id
                }
            })
    
            if (exist != null)
            {
                msg = "O usuário já é seu amigo."
            }
            else
            {
                Friends.create({
                    userID: id,
                    friendID: user.id
                })
                msg = "Usuário adicionado com sucesso! Aguardando aceitação da solicitação."
            }
        }
    }

    res.redirect(`/home/${id}/?msg=${msg}`)
})

router.post('/:id/addpost', async function(req, res){
    const id = req.params.id;
    // CORREÇÃO: Pegamos 'destination' e 'tp' diretamente da query, como já estava.
    const destination = req.query.destination;
    const tp = req.query.tp;
    const content = req.body.mensagem;

    let msg = "";
    let tpurl = "";

    if(content.trim() === "")
    {
        msg = "Insira uma mensagem antes de continuar!";
    }
    // CORREÇÃO: A verificação deve ser em 'destination', não em 'fid' e 'gid' que não existem aqui.
    else if(!destination)
    {
        msg = "Selecione um amigo ou grupo antes de continuar!";
    }
    else
    {
        await Post.create({
                content: content,
                author: id,
                destination: destination,
                destinationtp: tp
        });
        
        msg = "Postagem realizada com sucesso!";
    }

    // A lógica de redirecionamento continua a mesma
    if(tp == 0){ tpurl="friend"; }
    if(tp == 1){ tpurl="group"; }
    
    // Se não houver destino, redireciona para a home geral
    if (!destination) {
        res.redirect(`/home/${id}/?msg=${msg}`);
    } else {
        res.redirect(`/home/${id}/?${tpurl}=${destination}&msg=${msg}`);
    }
});

router.post('/:id/removeFriend', async function(req, res){
    id = req.params.id;
    fId = req.query.friend;

    friends = await Friends.findOne({
        where:{ [Op.or]: 
            [{userID: fId, friendID: id}, {friendID: fId, userID: id}], status: 1}
    })

    if(friends.length == 0)
    {
        msg = "A amizade não foi encontrada"
    }
    else
    {
        Friends.destroy(
            {where: {id: friends.id}}
        )
        msg = "Amizade removida com sucesso!"
    }
    res.redirect(`/home/${id}/?msg=${msg}`)
})

router.post('/:id/searchGroup', async function(req, res){
    id = req.params.id;
    groupname = req.body.groupname;

    if(groupname.trim() == "")
        {
            msggp = "Informe o nome do grupo antes de continuar!"
        }
    else
    {
        group = await Group.findOne({
            where: {name: groupname}
        })
    
        if(group == null)
            {
                msggp = "Grupo não encontrado."
            }
        else
        {
            exist = await Members.findOne({
                where: {memberID: id,
                        groupID: group.id
                }
            })
    
            if (exist != null)
            {
                msggp = "Você já é membro deste grupo."
            }
            else
            {
                Members.create({
                    memberID: id,
                    groupID: group.id
                })
                msggp = "Grupo adicionado com sucesso! Aguardando aceitação da solicitação."
            }
        }
    }

    res.redirect(`/home/${id}/?msggp=${msggp}`)
})

router.post('/:id/addgroup', async function(req, res)
{
    id = req.params.id;
    groupname = req.body.groupname;

    group = await Group.findOne({
        where: {name: groupname}
    })
    
    if(group != null)
    {
        msggp = "Nome de grupo já existente, não foi possível concluir o cadastro."
    }
    else
    {
        group = await Group.create({
            name: groupname,
            admin: id
        })

        Members.create({
            groupID: group.id,
            memberID: id,
            status: true
        })

        msggp = "Grupo cadastrado com sucesso!"
    }
    res.redirect(`/home/${id}/?msggp=${msggp}`)
})

router.post('/:id/removeGroup', async function(req, res){
    id = req.params.id;
    gId = req.query.group;

    members = await Members.findOne({
        where:{ memberID: id, groupID: gId, status: 1}
    })

    group = await Group.findOne({
        where:{ id: gId}
    })

    if(!members)
    {
        msg = "O grupo não foi encontrado"
    }
    else
    {
        Members.destroy(
            {where: {id: members.id}}
        )

        if(group)
        {
            if(group.admin == id)
            {
                Group.destroy(
                    {where: {id: gId}}
                )

                Members.destroy(
                    {where: {groupID: gId}}
                )
            }
        }

        msg = "Grupo removido com sucesso!"
    }
    res.redirect(`/home/${id}/?msg=${msg}`)
})

module.exports = router;

