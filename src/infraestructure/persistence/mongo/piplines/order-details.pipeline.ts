import { PipelineStage, Types } from 'mongoose';

export const buildOrderDetailPipeline = (id: string): PipelineStage[] => [
  {
    $match: {
      _id: new Types.ObjectId(id),
    },
  },
  {
    $project: {
      _id: 0,
      customer_name: 1,
      customer_phone: 1,
      delivery_address: 1,
      notes: 1,
      items: 1,
      courier_name: {
        $cond: [
          { $ifNull: ['$courier_name', false] },
          '$courier_name',
          '$$REMOVE',
        ],
      },
    },
  },
];
