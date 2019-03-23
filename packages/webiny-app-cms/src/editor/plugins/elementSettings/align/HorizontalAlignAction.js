// @flow
import * as React from "react";
import { connect } from "webiny-app-cms/editor/redux";
import { compose, withHandlers, withProps } from "recompose";
import { Plugin } from "webiny-app/components/Plugins";
import { set } from "dot-prop-immutable";
import { updateElement } from "webiny-app-cms/editor/actions";
import { getActiveElement } from "webiny-app-cms/editor/selectors";
import { get } from "dot-prop-immutable";
import { ReactComponent as AlignCenterIcon } from "webiny-app-cms/editor/assets/icons/format_align_center.svg";
import { ReactComponent as AlignLeftIcon } from "webiny-app-cms/editor/assets/icons/format_align_left.svg";
import { ReactComponent as AlignJustifyIcon } from "webiny-app-cms/editor/assets/icons/format_align_justify.svg";
import { ReactComponent as AlignRightIcon } from "webiny-app-cms/editor/assets/icons/format_align_right.svg";

// Icons map for dynamic render
const icons = {
    left: <AlignLeftIcon />,
    center: <AlignCenterIcon />,
    right: <AlignRightIcon />,
    justify: <AlignJustifyIcon />
};

const HorizontalAlignAction = ({ element, children, alignElement, align }: Object) => {
    return (
        <Plugin name={element.type}>
            {({ plugin }) =>
                !plugin
                    ? null
                    : React.cloneElement(children, { onClick: alignElement, icon: icons[align] })
            }
        </Plugin>
    );
};

const defaultOptions = { alignments: ["left", "center", "right", "justify"] };

export default compose(
    connect(
        state => ({ element: getActiveElement(state) }),
        { updateElement }
    ),
    withProps(({ element }) => ({
        align: get(element, "data.settings.horizontalAlign") || "left"
    })),
    withHandlers({
        alignElement: ({
            updateElement,
            element,
            align,
            options: { alignments } = defaultOptions
        }) => {
            return () => {
                const types = Object.keys(icons).filter(key =>
                    alignments ? alignments.includes(key) : true
                );

                const nextAlign = types[types.indexOf(align) + 1] || "left";

                updateElement({
                    element: set(element, "data.settings.horizontalAlign", nextAlign)
                });
            };
        }
    })
)(HorizontalAlignAction);
