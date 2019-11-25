import Database from '../database'
import Utils from '../Utils'
import FT from '../../common/interfaces/field'
import express, { Router, Request, Response } from 'express'

export default function conf (req: Request, res: Response) {
  const scoreDbInfoList = Database.getScoreDbInfoList()
  const fieldTransDict = FT

  Utils.success(res, '', {
    scoreDbInfoList,
    fieldTransDict
  })
}
