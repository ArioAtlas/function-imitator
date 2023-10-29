Easily make one function imitate or mimic the properties and behaviors of another while preserving its identity.

## Installation
Install via npm:

```
npm install function-imitator
```

## Usage
```
import { imitate } from 'function-imitator';

function original() {
    console.log('This is the original function');
}

function imitator() {
    console.log('This is the imitator function');
}

// Make `imitator` mimic `original`
imitate(imitator, original);

// Calling `imitator` now behaves like `original`
imitator(); // Outputs: "This is the original function"
```

## Options
The `imitate` function accepts an optional third argument for configuration:

* **ignoreNonConfigurable** (default: false): If set to true, the function won't attempt to copy non-configurable properties from the source to the target function.


Example:
```
imitate(to, from, { ignoreNonConfigurable: true });
```

## Rationale
There are scenarios where you might want to replace a function with another (e.g., for mocking, extending behaviors, or A/B testing) but still want to preserve some of the original function's identity and characteristics. This utility facilitates that.

## Limitations
1. Protected properties like `length`, `prototype`, `arguments`, and `caller` are not copied from the source function.
2. Functions being passed should not be arrow functions, as they do not have properties like `prototype`.


## License
MIT

