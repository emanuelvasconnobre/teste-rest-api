const express = require('express')
const router = express.Router()
const multer = require('multer')
const login = require('../middleware/login')
const produtoController = require('../controllers/produtos-controller')

function getDataAtual(data) {
    var dia = String(data.getDate()).padStart(2, '0');
    var mes = String(data.getMonth() + 1).padStart(2, '0');
    var ano = data.getFullYear();
    dataAtual = dia + '-' + mes + '-' + ano;
    return dataAtual
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
        console.log('vc sabe oq isso significa')
    },
    filename: function(req, file, cb) {
        var data = new Date();
        var dataAtual = getDataAtual(data)
        var uniqueSuffix = dataAtual + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

// RETORNA TODOS OS PRODUTOS
router.get(
    '/',
    produtoController.getProdutos
)

// INSERE UM PRODUTO
router.post(
    '/',
    login.obrigatorio,
    upload.single('imagem_produto'),
    produtoController.postProduto
)

// RETORNA UM DADO DE UM PRODUTO POR ID
router.get(
    '/:id_produto',
    produtoController.getSingleProduto
)

// ALTERA UM PRODUTO
router.patch(
    '/',
    login.obrigatorio,
    produtoController.patchProduto
)

// REMOVE UM PRODUTO
router.delete(
    '/',
    login.obrigatorio,
    produtoController.deleteProduto
)

module.exports = router