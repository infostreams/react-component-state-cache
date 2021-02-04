# react-component-state-cache

Adds a simple caching mechanism so that components can remember their state when they are
mounted, unmounted, and re-mounted.

Useful for when you need to remember (for example) user input in a search field between 
page navigations, or for any kind of data that is not worth it to store in global state
(e.g. whether or not the user collapsed a certain info panel). 

The cache is cleared when the user reloads the page / your app, so there is no persistence.

## Installation

    npm install infostreams/react-component-state-cache

Then include the ```<ComponentStateContext />``` component somewhere high up in your React DOM,
for example like this

    import React from 'react'
    import {ComponentStateCache} from 'react-component-state-cache'
    import {Provider} from 'react-redux' // for example
    import MyApp from './MyApp.js'

    class AppWrapper extends React.Component {
        render() {
            return (
                <Provider store={this.store}>
                    <ComponentStateCache>
                        <MyApp />
                    </ComponentStateCache>
                </Provider>
            )
        }
    }

## Example use

Now that you've installed the library, you can start using it in your components as follows:


    import React from 'react'
    import { withComponentStateCache } from 'react-component-state-cache'

    class X extends React.Component {

        constructor(props) {
            super(props)

            this.state = {
                // anything, really.
            }
        }

        componentDidMount() {
            // Restore the component state as it was stored for key '35' in section 'lesson'
            //
            // You can choose 'section' and 'key' freely, of course.
            this.setState(this.props.componentstate.get('lesson', 35))
        }

        componentDidUnmount() {
             // store this state's component in section 'lesson' with key '35'
            this.props.componentstate.set('lesson', 35, this.state)
        }

    }

    export default withComponentStateCache(X)

or

    export default connect(null, null, null, {forwardRef: true})(withComponentStateCache(X))

I'm sure you could also use this with hooks, but I'm not sure how. Pull requests for documentation welcome.

**Cache expiration**

You can remove all cached states in a section by calling

    this.props.componentstate.remove('lesson')

or you can remove specific states by calling

    this.props.componentstate.remove('lesson', 35)

The cache is also cleared whenever the user reloads your app.
