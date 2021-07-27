const express = require('express')
const exphbs  = require('express-handlebars')
const SettingsBill = require('./settings-bill')

const app = express()
const settingsBill = SettingsBill();

app.engine('handlebars', exphbs({layoutsDir: "views/layouts/"}))
app.set('view engine', 'handlebars')

app.use(express.static('public'))

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))
// parse application/json
app.use(express.json())

app.get("/", (req, res) => {
    let className = '';

    if(settingsBill.hasReachedWarningLevel()){
        className = 'warning'
    }
    if(settingsBill.hasReachedCriticalLevel()){
        className = 'danger'
    }
    res.render('index', {
        settings: settingsBill.getSettings(),
        totals: settingsBill.totals(),
        classNames: className
    })

    if(settingsBill.totals().grandTotal<settingsBill.getSettings().criticalLevel){
        
    }
})

app.post("/settings", (req, res) => {
    settingsBill.setSettings({
        callCost: req.body.callCost,
        smsCost: req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel
    })
    res.redirect("/")
})

app.post("/action", (req, res) => {
    settingsBill.recordAction(req.body.actionType)
    res.redirect("/")
})

app.get("/actions", (req, res) => {
    res.render('actions', {actions: settingsBill.actions()})
})

app.get("/actions/:actionType", (req, res) => {
    const actionType = req.params.actionType
    res.render('actions', {actions: settingsBill.actionsFor(actionType)})
})

const PORT = process.env.PORT || 3011

app.listen(PORT, () => {
    console.log("App is running at port " + PORT)
})