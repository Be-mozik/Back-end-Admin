const { evenement } = require("../../models/event/event");
const { utilisateur } = require("../../models/utilisateur/utilisateur");
const billet = require("../../controllers/billet/billetController");
const info = require("../../controllers/infoline/infolineController");
const moment = require('moment-timezone');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'uploads/');
    },
    filename: (req,file,cb)=>{
        cb(null,Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({storage: storage});

class EventController{

    async getAllEvent(req,res){
        try {
            const events = await evenement.findAll();
            res.json(events);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    async getEventById(req,res){
        try {
            const event = await evenement.findByPk(req.params.idEvent);
            res.json(event);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    async createEvent(req, res) {
        upload.single('photo')(req, res, async (err) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ message: 'Error uploading file' });
            }
            try {
                const { idutilisateur, nomevenement, dateheureevenement, lieuevenement, descrievenement, b, i } = req.body;
                const imgevenement = req.file ? req.file.filename : null;
                const user = await utilisateur.findByPk(idutilisateur);
                if (!user) {
                    return res.status(400).json({ message: 'Erreur: Utilisateur non trouvé' });
                }
                const dateheure = moment(dateheureevenement).tz('Asia/Baghdad').format('YYYY-MM-DD HH:mm:ss');
                const event = await evenement.create({
                    idutilisateur: idutilisateur,
                    nomevenement: nomevenement,
                    dateheureevenement: dateheure,
                    lieuevenement: lieuevenement,
                    descrievenement: descrievenement,
                    imgevenement: imgevenement
                });
                const billets = typeof b === 'string' ? JSON.parse(b) : b;
                const infos = typeof i === 'string' ? JSON.parse(i) : i;
                for( const billetData of billets){
                    await billet.createBillet(event.idevenement,billetData.nombillet,billetData.tarifbillet);
                }
                for( const infoData of infos ){
                    await info.createInfo(event.idevenement,infoData.numeroinfo,infoData.nominfo);
                }
                res.status(200).json(event);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Une erreur est survenue lors de la création de l\'événement' });
            }
        });
    }


    async updateEvent(req,res){
        upload.single('photo')(req, res, async (err) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ message: 'Error uploading file' });
            }
        try {
            const { idevenement,nomevenement,dateheureevenement,lieuevenement,descievenement,b,i } = req.body;
            const imgevenement = req.file ? req.file.filename : null;
            const event = await evenement.findByPk(idevenement);
            if(!event){
                return res.status(400).send({message: 'Evenement inconnu.'});
            }
            await event.update({
                nomevenement: nomevenement,
                dateheureevenement: dateheureevenement,
                lieuevenement: lieuevenement,
                descievenement: descievenement,
                imgevenement: imgevenement
            });
            const billets = typeof b === 'string' ? JSON.parse(b) : b;
            const infos = typeof i === 'string' ? JSON.parse(i) : i;
            for(const dataBillet of billets ){
                await billet.updateBillet(dataBillet.idbillet, dataBillet.nombillet,dataBillet.tarifbillet);
            }
            for(const dataInfo of infos){
                await info.updateInfo(dataInfo.idinfo,dataInfo.numeroinfo,dataInfo.nominfo);
            }
            res.status(200).send({success: `Evenement ${event.nomevenement} modifié.`});
        } catch (error) {
            res.status(500).send({message: 'Erreur lors de la mise à jour de l\'événement'});
        }
        });
    }
    

    async deleteEvenement(req,res){
        try {
            const event = await evenement.findByPk(req.params.idEvent);
            if(!event){
                return res.status(404).send({message: "Evenement inconnu."});
            }
            await evenement.destroy({
                where: {idevenement: event.idevenement}
            });
            res.status(200).send({success: 'Evenement supprimé'});
        } catch (error) {
            res.status(400).send(error);
        }
    }
}

module.exports = new EventController();