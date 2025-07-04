import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

function ActivePromptButtons({
    buttons,
    onButtonClick,
    onCancelTimerClick,
    onMouseOver,
    onMouseOut
}) {
    const MaxButtonTextLength = 28;
    const { t } = useTranslation();


    const getButtons = () => {
        let buttonIndex = 0;
        let result = [];

        if (!buttons || buttons.length === 0) {
            return null;
        }

        for (const button of buttons) {
            if (button.timer) {
                continue;
            }

            const originalButtonText = t(button.text, button.values);
            let buttonText = originalButtonText;

            if (buttonText.length > MaxButtonTextLength) {
                buttonText = buttonText.slice(0, MaxButtonTextLength - 3).trim() + '...';
            }

            let clickCallback = button.timerCancel
                ? (event) => onCancelTimerClick(event, button)
                : (event) =>
                    onButtonClick(
                        event,
                        button.command,
                        button.arg,
                        button.uuid,
                        button.method
                    );

            const btnClass = classNames(
                'btn prompt-button btn-stretch',
                button.class ? button.class : 'btn-default'
            );
            let option = (
                <button
                    key={button.command + buttonIndex.toString()}
                    className={btnClass}
                    title={originalButtonText}
                    onClick={clickCallback}
                    onMouseOver={(event) => onMouseOver(event, button.card)}
                    onMouseOut={(event) => onMouseOut(event, button.card)}
                    disabled={button.disabled}
                >
                    {buttonText}{' '}
                    {button.icon && <div className={`button-icon icon-${button.icon}`} />}
                </button>
            );

            buttonIndex++;

            result.push(option);
        }

        return result;
    };

    return getButtons();
}

export default ActivePromptButtons;
