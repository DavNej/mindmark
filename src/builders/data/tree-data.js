import { v4 as uuid } from 'uuid'

const data = {
  id: uuid(),
  name: 'Eve',
  children: [
    { id: uuid(), name: 'Cain' },
    {
      id: uuid(),
      name: 'Seth',
      children: [
        { id: uuid(), name: 'Enos' },
        { id: uuid(), name: 'Noam' },
      ],
    },
    { id: uuid(), name: 'Abel' },
    { id: uuid(), name: 'Awan', children: [{ id: uuid(), name: 'Enoch' }] },
    { id: uuid(), name: 'Azura' },
  ],
}

export default data
