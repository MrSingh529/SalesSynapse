import React, { useState, useRef } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Chip,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  CheckCircle,
  Error as ErrorIcon,
  Visibility,
  VisibilityOff,
  ArrowDropDown,
  Search,
  CalendarToday,
  AccessTime,
  Person,
  Email,
  Phone,
  LocationOn,
  AttachMoney,
  Business,
  Description
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { iOSStyles, iOSUtils } from '../../utils/iosAnimations';
import { motion } from 'framer-motion';

// iOS-style Text Input
export const IOSTextField = React.forwardRef(({
  label,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  type = 'text',
  placeholder,
  startIcon,
  endIcon,
  multiline = false,
  rows = 1,
  onFocus,
  onBlur,
  sx = {},
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { pressAnimation } = useIOSAnimations();
  const inputRef = useRef(null);

  const handleFocus = (e) => {
    setFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e) => {
    setFocused(false);
    if (onBlur) onBlur(e);
  };

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const getInputType = () => {
    if (type === 'password' && showPassword) return 'text';
    return type;
  };

  const getIconForType = () => {
    if (startIcon) return startIcon;
    
    const icons = {
      email: <Email sx={{ color: iOSStyles.colors.systemGray }} />,
      tel: <Phone sx={{ color: iOSStyles.colors.systemGray }} />,
      password: null, // Handled separately
      text: null,
      number: null,
      search: <Search sx={{ color: iOSStyles.colors.systemGray }} />,
    };
    
    return icons[type] || null;
  };

  return (
    <motion.div
      whileTap={{ scale: 0.995 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <Box
        onClick={handleContainerClick}
        sx={{
          position: 'relative',
          cursor: disabled ? 'not-allowed' : 'text',
          ...sx,
        }}
      >
        <TextField
          inputRef={ref || inputRef}
          fullWidth
          label={label}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          error={!!error}
          helperText={helperText || ''}
          type={getInputType()}
          placeholder={placeholder}
          multiline={multiline}
          rows={rows}
          onFocus={handleFocus}
          onBlur={handleBlur}
          variant="outlined"
          InputProps={{
            startAdornment: getIconForType() ? (
              <InputAdornment position="start">
                {getIconForType()}
              </InputAdornment>
            ) : null,
            endAdornment: type === 'password' ? (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    iOSUtils.hapticFeedback('light');
                    setShowPassword(!showPassword);
                  }}
                  edge="end"
                  sx={{ color: iOSStyles.colors.systemGray }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ) : endIcon ? (
              <InputAdornment position="end">
                {endIcon}
              </InputAdornment>
            ) : null,
            sx: {
              borderRadius: iOSStyles.borderRadius.medium,
              backgroundColor: disabled 
                ? iOSStyles.colors.systemGray6 
                : focused 
                  ? iOSStyles.colors.systemBackground 
                  : iOSStyles.colors.systemGray6,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover:not(.Mui-disabled)': {
                backgroundColor: iOSStyles.colors.systemGray5,
              },
              '&.Mui-focused': {
                backgroundColor: iOSStyles.colors.systemBackground,
                boxShadow: `0 0 0 4px ${error ? iOSStyles.colors.systemRed : iOSStyles.colors.systemBlue}20`,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: error 
                  ? iOSStyles.colors.systemRed 
                  : focused 
                    ? iOSStyles.colors.systemBlue 
                    : iOSStyles.colors.systemGray4,
                borderWidth: focused ? '2px' : '1px',
              },
              '&:hover .MuiOutlinedInput-notchedOutline:not(.Mui-focused)': {
                borderColor: error 
                  ? iOSStyles.colors.systemRed 
                  : iOSStyles.colors.systemGray3,
              },
            },
          }}
          InputLabelProps={{
            sx: {
              fontSize: '15px',
              color: iOSStyles.colors.secondaryLabel,
              '&.Mui-focused': {
                color: error ? iOSStyles.colors.systemRed : iOSStyles.colors.systemBlue,
              },
              '&.Mui-error': {
                color: iOSStyles.colors.systemRed,
              },
            },
          }}
          FormHelperTextProps={{
            sx: {
              fontSize: '13px',
              marginLeft: 0,
              marginTop: 1,
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              fontSize: '17px',
              '& input': {
                padding: isMobile ? '14px 12px' : '16px 14px',
              },
              '& textarea': {
                padding: isMobile ? '14px 12px' : '16px 14px',
              },
            },
          }}
          {...props}
        />

        {/* Validation status icon */}
        {value && !error && focused && (
          <Fade in={true}>
            <Box
              sx={{
                position: 'absolute',
                right: type === 'password' ? 48 : 14,
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <CheckCircle sx={{ 
                color: iOSStyles.colors.systemGreen,
                fontSize: 20,
              }} />
            </Box>
          </Fade>
        )}

        {/* Error icon */}
        {error && (
          <Fade in={true}>
            <Box
              sx={{
                position: 'absolute',
                right: type === 'password' ? 48 : 14,
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ErrorIcon sx={{ 
                color: iOSStyles.colors.systemRed,
                fontSize: 20,
              }} />
            </Box>
          </Fade>
        )}
      </Box>
    </motion.div>
  );
});

// iOS-style Select Dropdown
export const IOSSelect = React.forwardRef(({
  label,
  value,
  onChange,
  options = [],
  error,
  helperText,
  required = false,
  disabled = false,
  startIcon,
  sx = {},
  ...props
}, ref) => {
  const [open, setOpen] = useState(false);
  const { pressAnimation } = useIOSAnimations();
  const selectRef = useRef(null);

  const handleOpen = () => {
    if (!disabled) {
      iOSUtils.hapticFeedback('light');
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    iOSUtils.hapticFeedback('light');
    onChange(event);
  };

  return (
    <motion.div
      whileTap={{ scale: 0.995 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <FormControl 
        fullWidth 
        error={!!error}
        disabled={disabled}
        sx={sx}
      >
        <InputLabel
          sx={{
            fontSize: '15px',
            color: iOSStyles.colors.secondaryLabel,
            '&.Mui-focused': {
              color: error ? iOSStyles.colors.systemRed : iOSStyles.colors.systemBlue,
            },
            '&.Mui-error': {
              color: iOSStyles.colors.systemRed,
            },
          }}
        >
          {label}
        </InputLabel>
        <Select
          ref={ref || selectRef}
          value={value}
          onChange={handleChange}
          onOpen={handleOpen}
          onClose={handleClose}
          open={open}
          label={label}
          required={required}
          IconComponent={ArrowDropDown}
          sx={{
            borderRadius: iOSStyles.borderRadius.medium,
            backgroundColor: disabled 
              ? iOSStyles.colors.systemGray6 
              : iOSStyles.colors.systemGray6,
            fontSize: '17px',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover:not(.Mui-disabled)': {
              backgroundColor: iOSStyles.colors.systemGray5,
            },
            '&.Mui-focused': {
              backgroundColor: iOSStyles.colors.systemBackground,
              boxShadow: `0 0 0 4px ${error ? iOSStyles.colors.systemRed : iOSStyles.colors.systemBlue}20`,
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: error 
                ? iOSStyles.colors.systemRed 
                : open 
                  ? iOSStyles.colors.systemBlue 
                  : iOSStyles.colors.systemGray4,
              borderWidth: open ? '2px' : '1px',
            },
            '&:hover .MuiOutlinedInput-notchedOutline:not(.Mui-focused)': {
              borderColor: error 
                ? iOSStyles.colors.systemRed 
                : iOSStyles.colors.systemGray3,
            },
            '& .MuiSelect-select': {
              padding: '16px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                borderRadius: iOSStyles.borderRadius.medium,
                marginTop: '8px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                border: `1px solid ${iOSStyles.colors.systemGray5}`,
                maxHeight: 300,
                '& .MuiMenuItem-root': {
                  fontSize: '17px',
                  padding: '12px 16px',
                  '&:hover': {
                    backgroundColor: iOSStyles.colors.systemGray6,
                  },
                  '&.Mui-selected': {
                    backgroundColor: `${iOSStyles.colors.systemBlue}20`,
                    '&:hover': {
                      backgroundColor: `${iOSStyles.colors.systemBlue}30`,
                    },
                  },
                },
              },
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
          }}
          {...props}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                {option.icon && (
                  <Box sx={{ color: iOSStyles.colors.systemGray }}>
                    {option.icon}
                  </Box>
                )}
                <Typography sx={{ flex: 1 }}>
                  {option.label}
                </Typography>
                {value === option.value && (
                  <CheckCircle sx={{ 
                    color: iOSStyles.colors.systemBlue,
                    fontSize: 20,
                  }} />
                )}
              </Box>
            </MenuItem>
          ))}
        </Select>
        {helperText && (
          <Typography
            variant="caption"
            sx={{
              color: error ? iOSStyles.colors.systemRed : iOSStyles.colors.secondaryLabel,
              marginLeft: 0,
              marginTop: 1,
              fontSize: '13px',
            }}
          >
            {helperText}
          </Typography>
        )}
      </FormControl>
    </motion.div>
  );
});

// iOS-style Date Picker
export const IOSDatePicker = React.forwardRef(({
  label,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  minDate,
  maxDate,
  sx = {},
  ...props
}, ref) => {
  const [open, setOpen] = useState(false);
  const { pressAnimation } = useIOSAnimations();
  const pickerRef = useRef(null);

  const handleOpen = () => {
    if (!disabled) {
      iOSUtils.hapticFeedback('light');
      setOpen(true);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <motion.div
        whileTap={{ scale: 0.995 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <DatePicker
          ref={ref || pickerRef}
          label={label}
          value={value}
          onChange={onChange}
          disabled={disabled}
          minDate={minDate}
          maxDate={maxDate}
          open={open}
          onOpen={handleOpen}
          onClose={() => setOpen(false)}
          slotProps={{
            textField: {
              fullWidth: true,
              required,
              error: !!error,
              helperText,
              InputProps: {
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarToday sx={{ color: iOSStyles.colors.systemGray }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: iOSStyles.borderRadius.medium,
                  backgroundColor: disabled 
                    ? iOSStyles.colors.systemGray6 
                    : open 
                      ? iOSStyles.colors.systemBackground 
                      : iOSStyles.colors.systemGray6,
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover:not(.Mui-disabled)': {
                    backgroundColor: iOSStyles.colors.systemGray5,
                  },
                  '&.Mui-focused': {
                    backgroundColor: iOSStyles.colors.systemBackground,
                    boxShadow: `0 0 0 4px ${error ? iOSStyles.colors.systemRed : iOSStyles.colors.systemBlue}20`,
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: error 
                      ? iOSStyles.colors.systemRed 
                      : open 
                        ? iOSStyles.colors.systemBlue 
                        : iOSStyles.colors.systemGray4,
                    borderWidth: open ? '2px' : '1px',
                  },
                },
              },
              InputLabelProps: {
                sx: {
                  fontSize: '15px',
                  color: iOSStyles.colors.secondaryLabel,
                  '&.Mui-focused': {
                    color: error ? iOSStyles.colors.systemRed : iOSStyles.colors.systemBlue,
                  },
                },
              },
              FormHelperTextProps: {
                sx: {
                  fontSize: '13px',
                  marginLeft: 0,
                  marginTop: 1,
                },
              },
              sx: {
                '& .MuiOutlinedInput-root': {
                  fontSize: '17px',
                  '& input': {
                    padding: '16px 14px',
                  },
                },
                ...sx,
              },
            },
            popper: {
              sx: {
                '& .MuiPaper-root': {
                  borderRadius: iOSStyles.borderRadius.large,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                  border: `1px solid ${iOSStyles.colors.systemGray5}`,
                },
              },
            },
          }}
          {...props}
        />
      </motion.div>
    </LocalizationProvider>
  );
});

// iOS-style Time Picker
export const IOSTimePicker = React.forwardRef(({
  label,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  sx = {},
  ...props
}, ref) => {
  const [open, setOpen] = useState(false);
  const { pressAnimation } = useIOSAnimations();
  const pickerRef = useRef(null);

  const handleOpen = () => {
    if (!disabled) {
      iOSUtils.hapticFeedback('light');
      setOpen(true);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <motion.div
        whileTap={{ scale: 0.995 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <TimePicker
          ref={ref || pickerRef}
          label={label}
          value={value}
          onChange={onChange}
          disabled={disabled}
          open={open}
          onOpen={handleOpen}
          onClose={() => setOpen(false)}
          slotProps={{
            textField: {
              fullWidth: true,
              required,
              error: !!error,
              helperText,
              InputProps: {
                startAdornment: (
                  <InputAdornment position="start">
                    <AccessTime sx={{ color: iOSStyles.colors.systemGray }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: iOSStyles.borderRadius.medium,
                  backgroundColor: disabled 
                    ? iOSStyles.colors.systemGray6 
                    : open 
                      ? iOSStyles.colors.systemBackground 
                      : iOSStyles.colors.systemGray6,
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover:not(.Mui-disabled)': {
                    backgroundColor: iOSStyles.colors.systemGray5,
                  },
                  '&.Mui-focused': {
                    backgroundColor: iOSStyles.colors.systemBackground,
                    boxShadow: `0 0 0 4px ${error ? iOSStyles.colors.systemRed : iOSStyles.colors.systemBlue}20`,
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: error 
                      ? iOSStyles.colors.systemRed 
                      : open 
                        ? iOSStyles.colors.systemBlue 
                        : iOSStyles.colors.systemGray4,
                    borderWidth: open ? '2px' : '1px',
                  },
                },
              },
              InputLabelProps: {
                sx: {
                  fontSize: '15px',
                  color: iOSStyles.colors.secondaryLabel,
                  '&.Mui-focused': {
                    color: error ? iOSStyles.colors.systemRed : iOSStyles.colors.systemBlue,
                  },
                },
              },
              FormHelperTextProps: {
                sx: {
                  fontSize: '13px',
                  marginLeft: 0,
                  marginTop: 1,
                },
              },
              sx: {
                '& .MuiOutlinedInput-root': {
                  fontSize: '17px',
                  '& input': {
                    padding: '16px 14px',
                  },
                },
                ...sx,
              },
            },
            popper: {
              sx: {
                '& .MuiPaper-root': {
                  borderRadius: iOSStyles.borderRadius.large,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                  border: `1px solid ${iOSStyles.colors.systemGray5}`,
                },
              },
            },
          }}
          {...props}
        />
      </motion.div>
    </LocalizationProvider>
  );
});

// iOS-style Form Chip/Tag Input
export const IOSTagInput = ({
  label,
  value = [],
  onChange,
  placeholder = "Add a tag and press Enter",
  disabled = false,
  sx = {},
}) => {
  const [inputValue, setInputValue] = useState('');
  const { pressAnimation } = useIOSAnimations();
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      iOSUtils.hapticFeedback('light');
      const newTags = [...value, inputValue.trim()];
      onChange(newTags);
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      iOSUtils.hapticFeedback('light');
      const newTags = value.slice(0, -1);
      onChange(newTags);
    }
  };

  const handleRemove = (index) => {
    iOSUtils.hapticFeedback('light');
    const newTags = value.filter((_, i) => i !== index);
    onChange(newTags);
  };

  return (
    <Box sx={sx}>
      <Typography variant="body2" sx={{ 
        color: iOSStyles.colors.secondaryLabel, 
        mb: 1,
        fontSize: '15px',
      }}>
        {label}
      </Typography>
      
      <Box
        onClick={() => inputRef.current?.focus()}
        sx={{
          minHeight: 56,
          borderRadius: iOSStyles.borderRadius.medium,
          backgroundColor: iOSStyles.colors.systemGray6,
          border: `1px solid ${iOSStyles.colors.systemGray4}`,
          padding: '8px 12px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          alignItems: 'center',
          cursor: 'text',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: iOSStyles.colors.systemGray5,
            borderColor: iOSStyles.colors.systemGray3,
          },
          '&:focus-within': {
            backgroundColor: iOSStyles.colors.systemBackground,
            borderColor: iOSStyles.colors.systemBlue,
            borderWidth: '2px',
            boxShadow: `0 0 0 4px ${iOSStyles.colors.systemBlue}20`,
          },
        }}
      >
        {value.map((tag, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <Chip
              label={tag}
              onDelete={() => handleRemove(index)}
              size="small"
              sx={{
                borderRadius: iOSStyles.borderRadius.small,
                backgroundColor: `${iOSStyles.colors.systemBlue}20`,
                color: iOSStyles.colors.systemBlue,
                fontWeight: 500,
                fontSize: '13px',
                '& .MuiChip-deleteIcon': {
                  color: iOSStyles.colors.systemBlue,
                  fontSize: '16px',
                  '&:hover': {
                    color: iOSStyles.colors.systemBlue,
                  },
                },
              }}
            />
          </motion.div>
        ))}
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ''}
          disabled={disabled}
          style={{
            flex: 1,
            minWidth: 100,
            border: 'none',
            background: 'none',
            outline: 'none',
            fontSize: '17px',
            color: iOSStyles.colors.label,
            padding: '8px 0',
            fontFamily: 'inherit',
          }}
        />
      </Box>
    </Box>
  );
};

// iOS-style Form Section
export const IOSFormSection = ({ 
  title, 
  subtitle, 
  children, 
  error, 
  sx = {} 
}) => {
  return (
    <Box sx={{ mb: 4, ...sx }}>
      {title && (
        <Typography variant="h6" sx={{ 
          fontWeight: 700, 
          color: iOSStyles.colors.label,
          mb: 1,
          fontSize: '18px',
        }}>
          {title}
        </Typography>
      )}
      
      {subtitle && (
        <Typography variant="body2" sx={{ 
          color: iOSStyles.colors.secondaryLabel, 
          mb: 3,
          fontSize: '15px',
        }}>
          {subtitle}
        </Typography>
      )}
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: iOSStyles.borderRadius.medium,
            border: `1px solid ${iOSStyles.colors.systemRed}40`,
            backgroundColor: `${iOSStyles.colors.systemRed}15`,
          }}
        >
          {error}
        </Alert>
      )}
      
      {children}
    </Box>
  );
};

// iOS-style Form Validation Helper
export const useIOSFormValidation = () => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { shakeAnimation } = useIOSAnimations();

  const validateField = (name, value, rules) => {
    if (!rules) return null;

    for (const rule of rules) {
      if (rule.required && !value?.toString().trim()) {
        return rule.message || `${name} is required`;
      }
      
      if (rule.minLength && value?.length < rule.minLength) {
        return rule.message || `${name} must be at least ${rule.minLength} characters`;
      }
      
      if (rule.maxLength && value?.length > rule.maxLength) {
        return rule.message || `${name} must be less than ${rule.maxLength} characters`;
      }
      
      if (rule.pattern && !rule.pattern.test(value)) {
        return rule.message || `${name} is invalid`;
      }
      
      if (rule.min && parseFloat(value) < rule.min) {
        return rule.message || `${name} must be at least ${rule.min}`;
      }
      
      if (rule.max && parseFloat(value) > rule.max) {
        return rule.message || `${name} must be at most ${rule.max}`;
      }
    }
    
    return null;
  };

  const handleChange = (name, value, rules, onChange) => {
    // Update field value
    if (onChange) {
      onChange(value);
    }
    
    // Validate if touched
    if (touched[name]) {
      const error = validateField(name, value, rules);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name, value, rules) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value, rules);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = (fields) => {
    const newErrors = {};
    const newTouched = {};
    
    Object.keys(fields).forEach(name => {
      newTouched[name] = true;
      const error = validateField(name, fields[name].value, fields[name].rules);
      if (error) {
        newErrors[name] = error;
      }
    });
    
    setTouched(newTouched);
    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setErrors({});
    setTouched({});
  };

  const shakeField = (fieldName, elementRef) => {
    if (elementRef.current) {
      shakeAnimation(elementRef.current);
    }
  };

  return {
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    shakeField,
    setErrors,
    setTouched,
  };
};

export default {
  IOSTextField,
  IOSSelect,
  IOSDatePicker,
  IOSTimePicker,
  IOSTagInput,
  IOSFormSection,
  useIOSFormValidation,
};