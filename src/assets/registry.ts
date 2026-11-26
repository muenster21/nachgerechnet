import type React from "react";
import * as O from "./objects";
import * as F from "./furniture";
import * as B from "./buildings";
import * as I from "./icons";

/** Namen → Komponenten (für JSON-gesteuerte Szenen). */
export const ASSETS: Record<string, React.FC<any>> = {
  beer: O.BeerMug, bottle: O.BeerBottle, coin: O.Coin, money: O.MoneyStack, banknote: O.Banknote, calculator: O.Calculator,
  wallet: O.Wallet, phone: O.Phone, clock: O.Clock, key: O.KeyRing, piggy: O.PiggyBank, receipt: O.Receipt, calendar: O.Calendar,
  sparkle: O.Sparkle, sweat: O.SweatDrop, books: O.Books, blueprint: O.Blueprint, cocktail: O.CocktailGlass, chart: O.ChartBoard, tumbler: O.Tumbler, whiskey: O.WhiskeyBottle, chip: O.PokerChip, cue: O.Cue, card: O.CreditCard, pie: O.Pie, wrap: O.WrapRoll, microscope: O.Microscope, barrel: O.Barrel, moneypile: O.MoneyPile, tin: O.Tin, glasspiggy: O.GlassPiggy, laser: O.LaserDevice, tattoogun: O.TattooGun, notesheet: O.NoteSheet, goldstack: O.GoldStack, goldcube: O.GoldCube, sheep: O.Sheep, goat: O.Goat, suit: O.SuitHanger, suitcloset: O.SuitCloset, urn: O.Urn, duffel: O.Duffel, pillbottle: O.PillBottle,
  sofa: F.Sofa, armchair: F.Armchair, coffeetable: F.CoffeeTable, table: F.Table, tv: F.TV, plant: F.Plant, lamp: F.Lamp,
  rug: F.Rug, bookshelf: F.Bookshelf, frame: F.Frame, stool: F.Stool, booth: F.Booth, window: F.Window, door: F.Door, bed: F.Bed, pooltable: F.PoolTable, whiteboard: F.Whiteboard,
  hydrant: B.Hydrant, trash: B.TrashCan, taxi: B.Taxi, brownstone: B.Brownstone, highrise: B.Highrise, coupe: B.Coupe, piano: B.GrandPiano, palm: B.Palm, impala: B.Impala, gaspump: B.GasPump, motelsign: B.MotelSign, boat: B.Boat, dock: B.Dock, press: B.PrintingPress, dragon: B.Dragon,
  person: I.PersonIcon, dollar: I.DollarIcon, euro: I.EuroIcon, house: I.HouseIcon, beericon: I.BeerIcon, arrowdown: I.ArrowDown,
};

/** Versatz (dx, dy), damit ein gehaltenes Objekt „in der Hand liegt“ (Hand = Mitte des Objekts). */
export const HOLD_OFFSET: Record<string, [number, number]> = {
  beer: [0, 52], bottle: [0, 80], coin: [0, 30], money: [0, 24], banknote: [0, 38], calculator: [0, 60], wallet: [0, 36],
  phone: [0, 60], key: [0, 56], books: [0, 56], blueprint: [0, 72], cocktail: [0, 62], tumbler: [0, 42], whiskey: [0, 120], chip: [0, 40], cue: [0, 200], card: [0, 58], pie: [0, 40], wrap: [0, 40], tin: [0, 60], tattoogun: [0, 60], receipt: [0, 80], piggy: [0, 56], calendar: [0, 60], clock: [0, 60],
};
