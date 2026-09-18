export const openingTree = [
  {
    id: 1,
    name: 'Sicilian Defense',
    moves: ['e4', 'c5'],
    children: [
      {
        id: 2,
        name: 'Najdorf Variation',
        moves: ['Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6'],
        selected: true,
        children: [
          { id: 3, name: 'English Attack' },
          { id: 4, name: 'Poisoned Pawn' }
        ]
      },
      { id: 5, name: 'Dragon Variation' }
    ]
  },
  { id: 6, name: 'French Defense' }
];

export const pgnMoves = [
  "1. e4 c5", "2. Nf3 d6", "3. d4 cxd4", "4. Nxd4 Nf6", "5. Nc3 a6", 
  "6. Be3 e5", "7. Nb3 Be6", "8. f3 Be7", "9. Qd2 O-O", "10. O-O-O Nbd7",
  "11. g4 b5", "12. g5 b4"
];

export const strategicPlans = [
  {
    id: 1,
    title: "Control d5 square",
    description: "Establish central stability.",
    icon: "target"
  },
  {
    id: 2,
    title: "Kingside pawn storm",
    description: "Initiate attacking chances.",
    icon: "rocket"
  },
  {
    id: 3,
    title: "Piece activity",
    description: "Improve knight placement.",
    icon: "move"
  },
  {
    id: 4,
    title: "Queenside play",
    description: "Expand with a6-b5.",
    icon: "layers"
  }
];
