import express, { Router } from 'express'

const router: Router = Router()

router.get('/', require('./actions/index').default)
router.get('/conf', require('./actions/conf').default)
router.get('/query', require('./actions/query').default)
router.get('/allSchoolClass', require('./actions/allSchoolClass').default)

export default router
