// google auth
const express = require('express')
const routes = express.Router()
const { ensureAuth } = require('../middleware/auth')

const CreationGoal = require('../models/CreationGoal')

// @desc    Show add page
// @route   GET /creationGoals/add
routes.get('/add', ensureAuth, (req, res) => {
  res.render('creationGoals/add')
})

// @desc    Process add form
// @route   POST /creationGoals
routes.post('/', ensureAuth, async (req, res) => {
  try {
    console.log('$$$$$$$$$$$$$$$$$$$$ CreationGoal model:', CreationGoal);
    req.body.user = req.user.id
    await CreationGoal.create(req.body)    
    res.redirect('/dashboard')
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Show all creationGoals
// @route   GET /creationGoals
routes.get('/', ensureAuth, async (req, res) => {
  try {
    const creationGoals = await CreationGoal.find({ status: 'Public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()

    res.render('creationGoals/index', {
      creationGoals,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Show single creationGoal
// @route   GET /creationGoals/:id
routes.get('/:id', ensureAuth, async (req, res) => {
  try {
    let creation = await CreationGoal.findById(req.params.id).populate('user').lean()

    if (!creation) {
      return res.render('error/404')
    }

    if (creation.user._id != req.user.id && creation.status == 'private') {
      res.render('error/404')
    } else {
      res.render('creationGoals/show', {
        creation,
      })
    }
  } catch (err) {
    console.error(err)
    res.render('error/404')
  }
})

// @desc    Show edit page
// @route   GET /creationGoals/edit/:id
routes.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const creation = await CreationGoal.findOne({
      _id: req.params.id,
    }).lean()

    if (!creation) {
      return res.render('error/404')
    }

    if (creation.user != req.user.id) {
      res.redirect('/creationGoals')
    } else {
      res.render('creationGoals/edit', {
        creation,
      })
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Update creationGoal
// @route   PUT /creationGoals/:id
routes.put('/:id', ensureAuth, async (req, res) => {
  try {
    let creation = await CreationGoal.findById(req.params.id).lean()

    if (!creation) {
      return res.render('error/404')
    }

    if (creation.user != req.user.id) {
      res.redirect('/creationGoals')
    } else {
      creation = await CreationGoal.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })

      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Delete creationGoal
// @route   DELETE /creationGoals/:id
routes.delete('/:id', ensureAuth, async (req, res) => {
  try {
    let creation = await CreationGoal.findById(req.params.id).lean()

    if (!creation) {
      return res.render('error/404')
    }

    if (creation.user != req.user.id) {
      res.redirect('/creationGoals')
    } else {
      await CreationGoal.deleteOne({ _id: req.params.id })
      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    User creationGoals
// @route   GET /creationGoals/user/:userId
routes.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const creations = await CreationGoal.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean()

    res.render('creationGoals/index', {
      creations,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

//@desc Search creationGoals by title
//@route GET /creationGoals/search/:query
routes.get('/search/:query', ensureAuth, async (req, res) => {
  try{
      const creations = await CreationGoal.find({title: new RegExp(req.query.query,'i'), status: 'public'})
      .populate('user')
      .sort({ createdAt: 'desc'})
      .lean()
     res.render('creationGoals/index', { creations })
  } catch(err){
      console.log(err)
      res.render('error/404')
  }
})


module.exports = routes