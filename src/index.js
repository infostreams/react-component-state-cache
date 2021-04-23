import React from 'react'
import {parse, stringify} from 'flatted'

export const ComponentStateContext = React.createContext({})

export class ComponentStateCache extends React.Component {

    cache = {
        components: {},
    }

    /**
     * Store component state in the cache
     *
     * @param section The section to store the data in
     * @param key The key to retrieve the data by
     * @param data The data itself
     */
    set = (section, key, data) => {
        this.cache = {
            ...this.cache,
            components: {
                ...this.cache.components,
                [section]: {
                    ...this.cache.components?.[section],
                    // 1. we serialize the data so that the original object can be garbage collected
                    // 2. we use a special library ('flatted') to prevent errors about circular dependencies in JSON
                    [key]: stringify(data),
                }
            }
        }
    }

    /**
     * Retrieve component state from the cache
     *
     * @param section
     * @param key
     * @returns {any|null}
     */
    get = (section, key) => parse(this?.cache?.components?.[section]?.[key] || null) || null

    /**
     * Delete a key or a whole section from the component state cache
     *
     * @param section The section to remove, or the section the key is in.
     * @param key [optional] The key to remove. Leave empty to remove the whole section.
     * @returns {boolean} 'true' if the removal was successful.
     */
    remove = (section, key = null) => {
        if (key === null) {
            return delete this.cache?.components?.[section]
        } else {
            return delete this.cache?.components?.[section]?.[key]
        }
    }

    render() {
        return (
            <ComponentStateContext.Provider value={{
                set: this.set,
                get: this.get,
                remove: this.remove
            }}>
                {this.props.children}
            </ComponentStateContext.Provider>
        )
    }
}

/**
 * Higher-order component that adds a property 'this.props.componentstate'
 * with 'get', 'set' and 'remove' methods.
 *
 * @param ChildComponent
 */
export function withComponentStateCache(ChildComponent) {
    // - we do it the complicated way to make sure any refs you pass (for
    //   example when using this on a <Form> component) still work.

    class RefForwarder extends React.Component {
        render() {
            const {forwardedRef, ...props} = this.props
            // Assign the custom prop "forwardedRef" as a ref
            return (
                <ComponentStateContext.Consumer>
                    {
                        context => (
                            <ChildComponent
                                {...props}
                                ref={forwardedRef}
                                componentstate={context}
                            />
                        )
                    }
                </ComponentStateContext.Consumer>
            )
        }
    }

    return React.forwardRef((props, ref) => {
        return <RefForwarder {...props} forwardedRef={ref}/>
    })
}