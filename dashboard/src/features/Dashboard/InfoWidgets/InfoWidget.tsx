import Icon from '@/components/NIcon';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import React from 'react';

export type InfoWidgetProps = {
   title: string,
   image: string,
   value: string | number | any
}

const InfoWidget: React.FC<InfoWidgetProps> = ({ title, image, value = 0}) => {
   return (
      <Card className='flex flex-col p-4 gap-4 w-full h-[124px] justify-center items-center border-foreground'>
         <Label className='flex-0 text-md items-center text-center'>{title}</Label>

         <div className='flex justify-between w-full '>
            <Icon icon={image} size={48} />

            <div className='flex gap-1 '>
               <Label className=' text-2xl'>{value}</Label>
            </div>
         </div>
      </Card>
   )
}

export default InfoWidget