import { BadRequestError, SuccessResponse } from "@/core";
import { generateSign } from "@/utils/security.util";
import { NextFunction, Request, Response } from "express";

const TIME_REQUIREMENT = 30;
const chelseaClub = [
  { name: "Trevoh Chalobah", number: "25" },
  { name: "Reece James", number: "24" },
  { name: "Ben Chilwell", number: "5" },
  { name: "Wesley Fofana", number: "33" },
  { name: "Romeo Lavia", number: "45" },
];
const manUtdClub = [
  { name: "Harry Maguire", number: "5" },
  { name: "Lisandro Martinez", number: "6" },
  { name: "Bruno Fernandes", number: "8" },
  { name: "Antony", number: "11" },
  { name: "Casemiro", number: "14" },
];

class ReplayAttackController {
  testReplayAttack = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { stime, nonce, sign, club } = req.query;

    if (!stime || !nonce || !sign) throw new BadRequestError("Bad request!");

    const isTime = Math.floor((Date.now() - Number(stime)) / 1000);

    if (isTime > TIME_REQUIREMENT) throw new BadRequestError("Time expired!");

    const signServer = await generateSign(req.query);

    if (sign !== signServer)
      throw new BadRequestError("Bad request! invalid sign");

    return new SuccessResponse({
      message: "Success",
      metadata: club === "chelsea" ? chelseaClub : manUtdClub,
      status: 200,
    }).send(res);
  };
}

export default new ReplayAttackController();
