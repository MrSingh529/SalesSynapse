// Field permission configuration
export const FIELD_PERMISSIONS = {
    // Fields that are always read-only (system-generated)
    readOnly: ['createdAt', 'updatedAt', 'salesPersonId', 'salesPersonEmail', 'status', 'aiProcessed'],
    
    // Fields that can only be edited by managers
    managerOnly: ['salesPersonId', 'salesPersonEmail'],
    
    // Fields that are locked after a certain stage
    stageLocked: {
      // Example: After stage_3 (Negotiation), budget can't be changed
      stage_3: ['estimatedBudget'],
      stage_4: ['estimatedBudget', 'salesStage'],
      stage_5: ['estimatedBudget', 'salesStage', 'salesType'],
    },
    
    // Fields always editable
    alwaysEditable: [
      'additionalNotes',
      'actionable',
      'discussionDetails',
      'outcome',
      'contacts'
    ],
    
    // Fields that require manager approval to edit
    requireApproval: ['estimatedBudget', 'expenses'],
    
    // Time-based lock (e.g., 24 hours after creation)
    timeLockHours: 24, // Can't edit after 24 hours
  };
  
  // Get editable fields based on conditions
  export const getEditableFields = (visitData, userRole, userIsCreator) => {
    const editableFields = new Set();
    const createdAt = visitData.createdAt?.toDate?.() || new Date(visitData.createdAt);
    const now = new Date();
    const hoursSinceCreation = (now - createdAt) / (1000 * 60 * 60);
    
    // Check time lock
    const isTimeLocked = hoursSinceCreation > FIELD_PERMISSIONS.timeLockHours;
    
    // Check stage lock
    const currentStage = visitData.salesStage;
    const stageLockedFields = FIELD_PERMISSIONS.stageLocked[currentStage] || [];
    
    // Define all possible fields
    const allFields = [
      'companyName', 'visitDate', 'objective', 'outcome', 'leadName', 
      'estimatedBudget', 'salesType', 'salesStage', 'discussionDetails', 
      'actionable', 'additionalNotes', 'contacts', 'expenses'
    ];
    
    allFields.forEach(field => {
      let isEditable = true;
      
      // Check if field is always read-only
      if (FIELD_PERMISSIONS.readOnly.includes(field)) {
        isEditable = false;
      }
      
      // Check time lock
      if (isTimeLocked && !FIELD_PERMISSIONS.alwaysEditable.includes(field)) {
        isEditable = false;
      }
      
      // Check stage lock
      if (stageLockedFields.includes(field)) {
        isEditable = false;
      }
      
      // Check manager-only fields
      if (FIELD_PERMISSIONS.managerOnly.includes(field) && userRole !== 'manager') {
        isEditable = false;
      }
      
      // Allow creator to edit alwaysEditable fields
      if (userIsCreator && FIELD_PERMISSIONS.alwaysEditable.includes(field)) {
        isEditable = true;
      }
      
      // Allow managers to edit almost everything
      if (userRole === 'manager') {
        isEditable = true;
        // Even managers can't edit system fields
        if (FIELD_PERMISSIONS.readOnly.includes(field)) {
          isEditable = false;
        }
      }
      
      if (isEditable) {
        editableFields.add(field);
      }
    });
    
    return editableFields;
  };
  
  // Get reason why a field is locked
  export const getLockReason = (field, visitData, userRole, userIsCreator) => {
    const createdAt = visitData.createdAt?.toDate?.() || new Date(visitData.createdAt);
    const now = new Date();
    const hoursSinceCreation = (now - createdAt) / (1000 * 60 * 60);
    const currentStage = visitData.salesStage;
    const stageLockedFields = FIELD_PERMISSIONS.stageLocked[currentStage] || [];
    
    if (FIELD_PERMISSIONS.readOnly.includes(field)) {
      return 'This is a system-generated field and cannot be edited.';
    }
    
    if (hoursSinceCreation > FIELD_PERMISSIONS.timeLockHours && !FIELD_PERMISSIONS.alwaysEditable.includes(field)) {
      return `This field can only be edited within ${FIELD_PERMISSIONS.timeLockHours} hours of creation.`;
    }
    
    if (stageLockedFields.includes(field)) {
      return `This field is locked at the current sales stage (${currentStage}).`;
    }
    
    if (FIELD_PERMISSIONS.managerOnly.includes(field) && userRole !== 'manager') {
      return 'Only managers can edit this field.';
    }
    
    return null;
  };
