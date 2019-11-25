import express, { Router, Request, Response } from 'express'

export default function index (req: Request, res: Response) {
  res.send('Hello, World!')
}
