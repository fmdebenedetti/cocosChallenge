import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      { email: 'emiliano@test.com', accountNumber: '10001' },
      { email: 'jose@test.com', accountNumber: '10002' },
      { email: 'francisco@test.com', accountNumber: '10003' },
      { email: 'juan@test.com', accountNumber: '10004' },
    ],
  });

  await prisma.instrument.createMany({
    data: [
      { ticker: 'DYCA', name: 'Dycasa S.A.', type: 'ACCIONES' },
      { ticker: 'CAPX', name: 'Capex S.A.', type: 'ACCIONES' },
      { ticker: 'PGR', name: 'Phoenix Global Resources', type: 'ACCIONES' },
      { ticker: 'MOLA', name: 'Molinos Agro S.A.', type: 'ACCIONES' },
      { ticker: 'MIRG', name: 'Mirgor', type: 'ACCIONES' },
      { ticker: 'PATA', name: 'Importadora y Exportadora de la Patagonia', type: 'ACCIONES' },
      { ticker: 'TECO2', name: 'Telecom', type: 'ACCIONES' },
      { ticker: 'FERR', name: 'Ferrum S.A.', type: 'ACCIONES' },
      { ticker: 'SAMI', name: 'S.A San Miguel', type: 'ACCIONES' },
      { ticker: 'IRCP', name: 'IRSA Propiedades Comerciales S.A.', type: 'ACCIONES' },
      { ticker: 'GAMI', name: 'Boldt Gaming S.A.', type: 'ACCIONES' },
      { ticker: 'DOME', name: 'Domec', type: 'ACCIONES' },
      { ticker: 'INTR', name: 'Compañía Introductora de Buenos Aires S.A.', type: 'ACCIONES' },
      { ticker: 'MTR', name: 'Matba Rofex S.A.', type: 'ACCIONES' },
      { ticker: 'FIPL', name: 'Fiplasto', type: 'ACCIONES' },
      { ticker: 'GARO', name: 'Garovaglio Y Zorraquín', type: 'ACCIONES' },
      { ticker: 'SEMI', name: 'Molinos Juan Semino', type: 'ACCIONES' },
      { ticker: 'HARG', name: 'Holcim (Argentina) S.A.', type: 'ACCIONES' },
      { ticker: 'BPAT', name: 'Banco Patagonia', type: 'ACCIONES' },
      { ticker: 'RIGO', name: 'Rigolleau S.A.', type: 'ACCIONES' },
      { ticker: 'CVH', name: 'Cablevision Holding', type: 'ACCIONES' },
      { ticker: 'BBAR', name: 'Banco Frances', type: 'ACCIONES' },
      { ticker: 'LEDE', name: 'Ledesma', type: 'ACCIONES' },
      { ticker: 'CELU', name: 'Celulosa Argentina S.A.', type: 'ACCIONES' },
      { ticker: 'CECO2', name: 'Central Costanera', type: 'ACCIONES' },
      { ticker: 'AGRO', name: 'Agrometal', type: 'ACCIONES' },
      { ticker: 'AUSO', name: 'Autopistas del Sol', type: 'ACCIONES' },
      { ticker: 'BHIP', name: 'Banco Hipotecario S.A.', type: 'ACCIONES' },
      { ticker: 'BOLT', name: 'Boldt S.A.', type: 'ACCIONES' },
      { ticker: 'CARC', name: 'Carboclor S.A.', type: 'ACCIONES' },
      { ticker: 'BMA', name: 'Banco Macro S.A.', type: 'ACCIONES' },
      { ticker: 'CRES', name: 'Cresud S.A.', type: 'ACCIONES' },
      { ticker: 'EDN', name: 'Edenor S.A.', type: 'ACCIONES' },
      { ticker: 'GGAL', name: 'Grupo Financiero Galicia', type: 'ACCIONES' },
      { ticker: 'DGCU2', name: 'Distribuidora De Gas Cuyano S.A.', type: 'ACCIONES' },
      { ticker: 'GBAN', name: 'Gas Natural Ban S.A.', type: 'ACCIONES' },
      { ticker: 'CGPA2', name: 'Camuzzi Gas del Sur', type: 'ACCIONES' },
      { ticker: 'CADO', name: 'Carlos Casado', type: 'ACCIONES' },
      { ticker: 'GCLA', name: 'Grupo Clarin S.A.', type: 'ACCIONES' },
      { ticker: 'GRIM', name: 'Grimoldi', type: 'ACCIONES' },
      { ticker: 'RICH', name: 'Laboratorios Richmond', type: 'ACCIONES' },
      { ticker: 'MOLI', name: 'Molinos Río de la Plata', type: 'ACCIONES' },
      { ticker: 'VALO', name: 'BCO DE VALORES ACCIONES ORD.', type: 'ACCIONES' },
      { ticker: 'TGNO4', name: 'Transportadora de Gas del Norte', type: 'ACCIONES' },
      { ticker: 'LOMA', name: 'Loma Negra S.A.', type: 'ACCIONES' },
      { ticker: 'IRSA', name: 'IRSA Inversiones y Representaciones S.A.', type: 'ACCIONES' },
      { ticker: 'PAMP', name: 'Pampa Holding S.A.', type: 'ACCIONES' },
      { ticker: 'TGSU2', name: 'Transportadora de Gas del Sur', type: 'ACCIONES' },
      { ticker: 'TXAR', name: 'Ternium Argentina S.A', type: 'ACCIONES' },
      { ticker: 'YPFD', name: 'Y.P.F. S.A.', type: 'ACCIONES' },
      { ticker: 'MORI', name: 'Morixe Hermanos S.A.C.I.', type: 'ACCIONES' },
      { ticker: 'INVJ', name: 'Inversora Juramento S.A.', type: 'ACCIONES' },
      { ticker: 'POLL', name: 'Polledo S.A.', type: 'ACCIONES' },
      { ticker: 'METR', name: 'MetroGAS S.A.', type: 'ACCIONES' },
      { ticker: 'LONG', name: 'Longvie', type: 'ACCIONES' },
      { ticker: 'SUPV', name: 'Grupo Supervielle S.A.', type: 'ACCIONES' },
      { ticker: 'ROSE', name: 'Instituto Rosenbusch', type: 'ACCIONES' },
      { ticker: 'OEST', name: 'Oeste Grupo Concesionario', type: 'ACCIONES' },
      { ticker: 'COME', name: 'Sociedad Comercial Del Plata', type: 'ACCIONES' },
      { ticker: 'CEPU', name: 'Central Puerto', type: 'ACCIONES' },
      { ticker: 'ALUA', name: 'Aluar Aluminio Argentino S.A.I.C.', type: 'ACCIONES' },
      { ticker: 'CTIO', name: 'Consultatio S.A.', type: 'ACCIONES' },
      { ticker: 'TRAN', name: 'Transener S.A.', type: 'ACCIONES' },
      { ticker: 'HAVA', name: 'Havanna Holding', type: 'ACCIONES' },
      { ticker: 'BYMA', name: 'Bolsas y Mercados Argentinos S.A.', type: 'ACCIONES' },
      { ticker: 'ARS', name: 'PESOS', type: 'MONEDA' },
    ],
  });

  await prisma.marketData.createMany({
    data: [
        { instrumentId: 12, date: new Date('2023-07-13'), open: null, high: null, low: null, close: 20.5, previousClose: 20.5 },
        { instrumentId: 35, date: new Date('2023-07-13'), open: 337.5, high: 342.5, low: 328.5, close: 341.5, previousClose: 335.0 },
        { instrumentId: 54, date: new Date('2023-07-13'), open: 232.0, high: 232.0, low: 222.5, close: 232.0, previousClose: 229.0 },
        { instrumentId: 51, date: new Date('2023-07-13'), open: 35.9, high: 36.55, low: 35.75, close: 35.95, previousClose: 35.9 },
        { instrumentId: 52, date: new Date('2023-07-13'), open: 105.0, high: 105.0, low: 98.5, close: 99.7, previousClose: 103.0 },
        { instrumentId: 60, date: new Date('2023-07-13'), open: 358.0, high: 365.95, low: 354.45, close: 364.8, previousClose: 353.45 },
        { instrumentId: 31, date: new Date('2023-07-13'), open: 1425.0, high: 1541.0, low: 1415.0, close: 1520.25, previousClose: 1413.5 },
        { instrumentId: 40, date: new Date('2023-07-13'), open: 400.0, high: 400.0, low: 395.0, close: 397.5, previousClose: 400.0 },
        { instrumentId: 4, date: new Date('2023-07-13'), open: 6940.0, high: 7044.0, low: 6561.0, close: 6621.5, previousClose: 6659.5 },
        { instrumentId: 37, date: new Date('2023-07-13'), open: 407.0, high: 409.0, low: 388.5, close: 400.5, previousClose: 408.0 },
        { instrumentId: 44, date: new Date('2023-07-13'), open: 668.0, high: 669.5, low: 655.0, close: 668.0, previousClose: 658.0 },
        { instrumentId: 63, date: new Date('2023-07-13'), open: 367.5, high: 378.0, low: 366.0, close: 373.0, previousClose: 367.5 },
        { instrumentId: 18, date: new Date('2023-07-13'), open: 500.0, high: 525.0, low: 494.0, close: 515.5, previousClose: 498.0 },
        { instrumentId: 30, date: new Date('2023-07-13'), open: 6.7, high: 6.8, low: 6.66, close: 6.75, previousClose: 6.64 },
        { instrumentId: 25, date: new Date('2023-07-13'), open: 188.0, high: 195.0, low: 187.0, close: 192.75, previousClose: 187.5 },
        { instrumentId: 19, date: new Date('2023-07-13'), open: 273.0, high: 295.0, low: 266.0, close: 289.0, previousClose: 273.0 },
        { instrumentId: 6, date: new Date('2023-07-13'), open: 245.0, high: 256.0, low: 241.25, close: 251.5, previousClose: 247.25 },
        { instrumentId: 11, date: new Date('2023-07-13'), open: 86.5, high: 86.5, low: 84.0, close: 86.0, previousClose: 86.4 },
        { instrumentId: 17, date: new Date('2023-07-13'), open: 53.0, high: 54.0, low: 51.5, close: 53.2, previousClose: 52.0 },
        { instrumentId: 64, date: new Date('2023-07-13'), open: 1107.0, high: 1170.0, low: 1107.0, close: 1163.0, previousClose: 1122.0 },
    ],
  });

  await prisma.order.createMany({
    data: [
      { instrumentId: 66, userId: 1, size: 1000000, price: 1, side: 'CASH_IN', status: 'FILLED', type: 'MARKET', datetime: new Date('2023-07-12 12:11:20') },
      { instrumentId: 47, userId: 1, size: 50, price: 930, side: 'BUY', status: 'FILLED', type: 'MARKET', datetime: new Date('2023-07-12 12:31:20') },
      { instrumentId: 47, userId: 1, size: 50, price: 920, side: 'BUY', status: 'CANCELLED', type: 'LIMIT', datetime: new Date('2023-07-12 14:21:20') },
      { instrumentId: 47, userId: 1, size: 10, price: 940, side: 'SELL', status: 'FILLED', type: 'MARKET', datetime: new Date('2023-07-12 14:51:20') },
      { instrumentId: 45, userId: 1, size: 50, price: 710, side: 'BUY', status: 'NEW', type: 'LIMIT', datetime: new Date('2023-07-12 15:14:20') },
      { instrumentId: 47, userId: 1, size: 100, price: 950, side: 'SELL', status: 'REJECTED', type: 'MARKET', datetime: new Date('2023-07-12 16:11:20') },
      { instrumentId: 31, userId: 1, size: 60, price: 1500, side: 'BUY', status: 'NEW', type: 'LIMIT', datetime: new Date('2023-07-13 11:13:20') },
      { instrumentId: 66, userId: 1, size: 100000, price: 1, side: 'CASH_OUT', status: 'FILLED', type: 'MARKET', datetime: new Date('2023-07-13 12:31:20') },
      { instrumentId: 31, userId: 1, size: 20, price: 1540, side: 'BUY', status: 'FILLED', type: 'LIMIT', datetime: new Date('2023-07-13 12:51:20') },
      { instrumentId: 54, userId: 1, size: 500, price: 250, side: 'BUY', status: 'FILLED', type: 'MARKET', datetime: new Date('2023-07-13 14:11:20') },
      { instrumentId: 31, userId: 1, size: 30, price: 1530, side: 'SELL', status: 'FILLED', type: 'MARKET', datetime: new Date('2023-07-13 15:13:20') },
    ],
  });
  
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
