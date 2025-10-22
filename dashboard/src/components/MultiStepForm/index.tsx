import React, { useEffect } from 'react';
import StepsHeader from './StepsHeader';
import { useMultiStepFormStore } from '@/stores/MultiStepFormStore';
import { useDialogStore } from '@/stores/DialogStore';
import { useTranslation } from '@/hooks/useLanguage';

interface MultiStepFormProps {
   children: React.ReactNode;
   id?: string;
   onSubmit?: (data: any) => void | Promise<void>;
   onCancel?: () => void;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({ children, onSubmit }) => {
   const { t } = useTranslation();
   const currentStep = useMultiStepFormStore.use.currentStep();
   const goNext = useMultiStepFormStore.use.goNext();
   const goPrevious = useMultiStepFormStore.use.goPrevious();
   const updateFormData = useMultiStepFormStore.use.updateFormData();
   const formData = useMultiStepFormStore.use.formData();

   const {
      updatePrimaryButton,
      updateSecondaryButton,
      updateShowButtons,
      handleCancel
   } = useDialogStore();

   const stepChildren = React.Children.toArray(children);
   const totalSteps = stepChildren.length;
   const currentStepComponent: any = stepChildren[currentStep - 1];
   const isLastStep = currentStep === totalSteps;
   const isFirstStep = currentStep === 1;

   const steps = stepChildren.map((child: any, index) => ({
      number: index + 1,
      title: child.props.title || `Step ${index + 1}`
   }));

   const handleStepSubmit = async (stepData: any) => {
      updateFormData(stepData);
      if (currentStep < totalSteps) {
         goNext();
      } else {
         const finalData = { ...formData, ...stepData };
         await onSubmit(finalData)
      }
   };

   const handlePrevious = async () => {
      if (!isFirstStep) {
         goPrevious();
      }
   };

   useEffect(() => {
      updatePrimaryButton({
         text: isLastStep ? t('common.confirm') : t('common.next'),
         variant: isLastStep ? 'default' : 'default',
         form: currentStepComponent?.props.id, 
         loading: false,
         disabled: false
      });

      updateSecondaryButton({
         text: isFirstStep ? t('common.cancel') : t('common.previous'),
         variant: 'secondary',
         onClick: isFirstStep ? handleCancel : handlePrevious,
         loading: false,
         disabled: false
      });

      updateShowButtons(true);
   }, [currentStep, isFirstStep, isLastStep]);

   const currentStepWithSubmit = React.cloneElement(currentStepComponent, {
      onSubmit: handleStepSubmit,
      defaultValues: {
         ...currentStepComponent.props.defaultValues,
         ...formData
      },
   });

   return (
      <div className="flex w-full flex-col justify-center gap-4">
         <StepsHeader steps={steps} currentStep={currentStep} />
         {currentStepWithSubmit}
      </div>
   );
};

export default MultiStepForm;