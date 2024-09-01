const express = require('express');
const {PrismaClient} = require('@prisma/client');
const cors = require('cors')

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.use(cors());

app.post('/networks/add', async (req, res) => {
    try {
        const {number, name, frequency, alias, description, features, x, y} = req.body;

        const existingNetwork = await prisma.networks.findUnique({
            where: { number },
        });

        if (existingNetwork) {
            return res.status(400).json({
                isSuccess: false,
                error: `Network with number ${number} already exists.`,
            });
        }

        const network = await prisma.networks.create({
            data: {
                number,
                name,
                frequency,
                alias,
                description,
                features,
                x,
                y,
            },
        });
        res.status(201).json({isSuccess: true, item: network});
    } catch (error) {
        res.status(400).json({isSuccess: false, error: error.message});
    }
});
app.get('/networks/pagination', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const skip = (page - 1) * pageSize;

    try {
        const networks = await prisma.networks.findMany({
            skip: skip,
            take: pageSize,
        });

        const totalCount = await prisma.networks.count();
        const totalPages = Math.ceil(totalCount / pageSize);

        res.json({
            data: networks,
            meta: {
                totalItems: totalCount,
                totalPages: totalPages,
                currentPage: page,
                pageSize: pageSize,
            },
        });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

app.get('/networks/get', async (req, res) => {
    try {
        const networks = await prisma.networks.findMany();
        const totalCount = await prisma.networks.count();

        res.json({
            data: networks,
            meta: {
                totalItems: totalCount,
                totalPages: 1,
                currentPage: 1,
                pageSize: totalCount,
            },
        });
    } catch (err) {
        console.log(err)
    }
});

app.delete('/networks/delete/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const deletedNetwork = await prisma.networks.delete({
            where: {
                id: parseInt(id),
            },
        });

        res.status(200).json({isSuccess: true});
    } catch (error) {
        res.status(404).json({isSuccess: false, error: 'Network was not deleted'});
    }
});

app.put('/networks/update/:id', async (req, res) => {


    try {
        const {id} = req.params;
        const {number, name, frequency, alias, description, features, x, y} = req.body;
        const updetedNetwork = await prisma.networks.update({
            where: {
                id: parseInt(id),
            },
            data: {
                number,
                name,
                frequency,
                alias,
                description,
                features,
                x,
                y,
            },
        });

        res.status(200).json({isSuccess: true, network: updetedNetwork});
    } catch (error) {
        res.status(404).json({isSuccess: false, error: 'Network was not updated'});
    }
});


const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
