const { infoline } = require('../../models/infoline/infoline');

class InfolineController{
    async getAllInfo(req,res){
        try {
            const infos = await infoline.findAll();
            res.status(200).json(infos);
        } catch (error) {
            res.status(400).send(error);
        }
    }

    async getInfoById(req,res){
        try {
            const info = await infoline.findByPk(req.params.idInfo);
            res.status(200).json(info);
        } catch (error) {
            res.status(400).send(error);
        }
    }

    async getInfoByEvent(req,res){
        try {
            const infos = await infoline.findAll({where: {
                idevenement: req.params.idevenement
            }});
            res.status(200).json(infos);
        } catch (error) {
            res.status(400).send(error);
        }
    }

    async deleteInfo(req,res){
        try {
            const info = await infoline.findOne({where: {idinfo: req.params.idinfo}});
            if(!info){
                return res.status(400).send({message: "Info inconnue."});
            }
            await infoline.destroy({
                where: {idinfo: req.params.idinfo}
            });
            res.status(200).send("mety");
        } catch (error) {
            res.status(400).send(error);
        }
    }

    async updateInfo(req,res){
        try {
            const { idinfo, numeroinfo }= req.body;
            const info = await infoline.findByPk(idinfo);
            if(!info){
                return res.status(400).send({message: "Info inconnue."});
            }
            await info.update({
                numeroinfo: numeroinfo
            });
            res.status(200).send("mety");
        } catch (error) {
            res.status(400).send(error);
        }
    }

    async createInfo(req,res){
        try {
            const { idevenement,numeroinfo } = req.body;
            const info = await infoline.create({
                idevenement: idevenement,
                numeroinfo: numeroinfo
            });
            res.status(200).json(info);
        } catch (error) {
            res.status(500).send(error);
        }
    }

}

module.exports = new InfolineController();