import React from 'react'
import NForm from '../NForm'

const StepForm = ({
   id,
   schema,
   defaultValues,
   title,
   description = '',
   onSubmit = null,
   children
}) => {
   return (
      <div className="flex flex-col w-full max-w-2xl mx-auto gap-4">
         {(title || description) && (
            <div className="text-center">
               {/* {title && (
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                     {title}
                  </h2>
               )} */}
               {description && (
                  <p className="text-muted-foreground">
                     {description}
                  </p>
               )}
            </div>
         )}

         <NForm
            id={id}
            schema={schema}
            defaultValues={defaultValues}
            onSubmit={onSubmit}
         >
            <div className="space-y-4">
               {children}
            </div>
         </NForm>
      </div>
   )
}

export default StepForm