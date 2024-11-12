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

    // Capture the previous URL or set a default if not available
    const back = req.get('Referer') || "/creationGoals";

    res.render('creationGoals/index', {
      back,
      heading: ``,
      creationGoals     
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
    let creationGoal = await CreationGoal.findById(req.params.id).populate('user').lean()

    if (!creationGoal) {
      return res.render('error/404')
    }

    if (creationGoal.user._id != req.user.id && creationGoal.status == 'private') {
      res.render('error/404')
    } else {
      res.render('creationGoals/show', {
        creationGoal,
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
    const creationGoal = await CreationGoal.findOne({
      _id: req.params.id,
    }).lean()
    if (!creationGoal) {
      return res.render('error/404')
    }

    if (creationGoal.user != req.user.id) {
      res.redirect('/creationGoals')
    } else {
      res.render('creationGoals/edit', {
        creationGoal,
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
    let creationGoal = await CreationGoal.findById(req.params.id).lean()

    if (!creationGoal) {
      return res.render('error/404')
    }

    if (creationGoal.user != req.user.id) {
      res.redirect('/creationGoals')
    } else {
      creationGoal = await CreationGoal.findOneAndUpdate({ _id: req.params.id }, req.body, {
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
    let creationGoal = await CreationGoal.findById(req.params.id).lean()

    if (!creationGoal) {
      return res.render('error/404')
    }

    if (creationGoal.user != req.user.id) {
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
    const creationGoals = await CreationGoal.find({
      user: req.params.userId,      
      status: 'Public',
    })
      .populate('user')
      .lean()

    // Get the user from the first creationGoal (assuming user is populated correctly)
    const user = creationGoals[0]?.user;

    if (!user) {
      return res.render('error/404'); // Handle case where user is not found
    }

    res.render('creationGoals/index', {
      back: "/creationGoals",
      heading: `by ${user.displayName}`,
      creationGoals,
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
      const searchQuery = await req.query.query; // Capture the search term
      const creationGoals = await CreationGoal.find({goal: new RegExp(searchQuery,'i'), status: 'Public'})
      .populate('user')
      .sort({ createdAt: 'desc'})
      .lean()

    // Capture the previous URL or set a default if not available
    const back = req.get('Referer') || "/creationGoals";

    res.render('creationGoals/index', { 
      back,
      heading: `Search Results within Goal for "${searchQuery}"`,
      creationGoals 
    })
  } catch(err){
      console.log(err)
      res.render('error/404')
  }
})


module.exports = routes