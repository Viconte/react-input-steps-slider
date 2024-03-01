import React, { useState, useEffect, useRef } from 'react';
import { formatNumber, onlyNumbers, pluralize } from '../utils';
import styles from './index.module.css';

export const Input = ({ value, inputLabels, onBlur }) => {
    const inputRef = useRef();
    const [valueLocal, setValueLocal] = useState(value);
    const [editMode, setEditMode] = useState(false);

    const currentValue = editMode ? valueLocal : `${formatNumber(valueLocal)} ${pluralize(valueLocal, inputLabels)}`;

    const onEditMode = () => {
        setEditMode(true);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }

    const offEditMode = () => {
        setEditMode(false);
    }

    const onInputCallback = (event) => {
        setValueLocal(onlyNumbers(event?.target?.value));
    }

    const onFocusCallback = () => {
        onEditMode();
    }

    const onBlurCallback = () => {
        offEditMode();
        onBlur?.(valueLocal);
    }

    useEffect(() => {
        setValueLocal(value);
    },[value])

    return (
        <div className={styles.root}>
            <div className={styles.inputBox}>
                <div className={styles.inputContent}>{currentValue}</div>
                <input
                    ref={inputRef}
                    className={styles.input}
                    value={currentValue}
                    onInput={onInputCallback}
                    onFocus={onFocusCallback}
                    onBlur={onBlurCallback}
                />
            </div>
            {!editMode && <span className={styles.icon} onClick={onEditMode}/>}
        </div>
    )
}