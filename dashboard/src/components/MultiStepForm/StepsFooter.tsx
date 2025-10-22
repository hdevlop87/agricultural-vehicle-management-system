import React from 'react';
import { Button } from '@/components/ui/button';
import SubmitButton from '@/components/NButtons/SubmitButton';

const StepsFooter = ({ 
  currentStep, 
  isLastStep, 
  formId, 
  loading, 
  onPrevious 
}) => {
  return (
    <div className="flex gap-2 justify-end mt-24">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onPrevious} 
        disabled={currentStep === 1 || loading} 
        className='w-auto cursor-pointer'
      >
        Previous
      </Button>
      
      <SubmitButton 
        confirmText={isLastStep ? 'Submit' : 'Next'} 
        form={formId} 
        className='bg-primary hover:bg-primary/90 cursor-pointer w-auto' 
        loading={loading} 
      />
    </div>
  );
};

export default StepsFooter;