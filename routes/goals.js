// google auth
const express = require('express')
const routes = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Creation = require('../models/Creation')

// @desc    Show add page
// @route   GET /goals/add
routes.get('/add', ensureAuth, (req, res) => {
  res.render('goals/add')
})

// @desc    Process add form
// @route   POST /goals
routes.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id
    await Creation.create(req.body)
    res.redirect('/dashboard')
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Show all goals
// @route   GET /goals
routes.get('/', ensureAuth, async (req, res) => {
  try {
    const creations = await Creation.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()

    res.render('goals/index', {
      creations,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Show single goal
// @route   GET /goals/:id
routes.get('/:id', ensureAuth, async (req, res) => {
  try {
    let creation = await Creation.findById(req.params.id).populate('user').lean()

    if (!creation) {
      return res.render('error/404')
    }

    if (creation.user._id != req.user.id && creation.status == 'private') {
      res.render('error/404')
    } else {
      res.render('goals/show', {
        creation,
      })
    }
  } catch (err) {
    console.error(err)
    res.render('error/404')
  }
})

// @desc    Show edit page
// @route   GET /goals/edit/:id
routes.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const creation = await Creation.findOne({
      _id: req.params.id,
    }).lean()

    if (!creation) {
      return res.render('error/404')
    }

    if (creation.user != req.user.id) {
      res.redirect('/goals')
    } else {
      res.render('goals/edit', {
        creation,
      })
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Update goal
// @route   PUT /goals/:id
routes.put('/:id', ensureAuth, async (req, res) => {
  try {
    let creation = await Creation.findById(req.params.id).lean()

    if (!creation) {
      return res.render('error/404')
    }

    if (creation.user != req.user.id) {
      res.redirect('/goals')
    } else {
      creation = await Creation.findOneAndUpdate({ _id: req.params.id }, req.body, {
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

// @desc    Delete goal
// @route   DELETE /goals/:id
routes.delete('/:id', ensureAuth, async (req, res) => {
  try {
    let creation = await Creation.findById(req.params.id).lean()

    if (!creation) {
      return res.render('error/404')
    }

    if (creation.user != req.user.id) {
      res.redirect('/goals')
    } else {
      await Creation.deleteOne({ _id: req.params.id })
      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    User goals
// @route   GET /goals/user/:userId
routes.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const creations = await Creation.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean()

    res.render('goals/index', {
      creations,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

//@desc Search goals by title
//@route GET /goals/search/:query
routes.get('/search/:query', ensureAuth, async (req, res) => {
  try{
      const creations = await Creation.find({title: new RegExp(req.query.query,'i'), status: 'public'})
      .populate('user')
      .sort({ createdAt: 'desc'})
      .lean()
     res.render('goals/index', { creations })
  } catch(err){
      console.log(err)
      res.render('error/404')
  }
})


module.exports = routes