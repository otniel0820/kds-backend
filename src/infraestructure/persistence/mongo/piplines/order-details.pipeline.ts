import { PipelineStage, Types } from 'mongoose';

export const buildOrderDetailPipeline = (id: string): PipelineStage[] => [
  { $match: { _id: new Types.ObjectId(id) } },

  { $unwind: '$items' },

  {
    $lookup: {
      from: 'products',
      let: { productId: '$items.product' },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$_id', '$$productId'] },
                { $eq: ['$is_active', true] },
              ],
            },
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            image: 1,
            price: 1,
            currency: 1,
          },
        },
      ],
      as: 'productData',
    },
  },

  { $unwind: '$productData' },

  {
    $group: {
      _id: '$_id',

      customer_name: { $first: '$customer_name' },
      customer_phone: { $first: '$customer_phone' },
      delivery_address: { $first: '$delivery_address' },
      notes: { $first: '$notes' },
      courier_name: { $first: '$courier_name' },

      items: {
        $push: {
          qty: '$items.qty',
          product: {
            id: { $toString: '$productData._id' },
            name: '$productData.name',
            image: '$productData.image',
            price: '$productData.price',
            currency: '$productData.currency',
          },
        },
      },
    },
  },
  {
    $project: {
      _id: 0,
      customerName: '$customer_name',
      customerPhone: '$customer_phone',
      deliveryAddress: '$delivery_address',
      notes: 1,
      courierName: {
        $cond: [
          { $ifNull: ['$courier_name', false] },
          '$courier_name',
          '$$REMOVE',
        ],
      },
      items: 1,
    },
  },
];
