import { defineComponent, ref, nextTick, watch, withModifiers } from "vue";

export const ShowOrSelect = defineComponent({
  props: {
    value: [String, Number],
    onUpdateValue: [Function, Array],
    options: [Array],
  },
  setup(props) {
    const isEdit = ref(false);
    const selectRef = ref(null);
    const inputValue = ref(null);
    function handleOnClick() {
      isEdit.value = true;
      nextTick(() => {
        console.log(selectRef.value);
        if (!selectRef.value?.focused) {
          selectRef.value?.focus();
          selectRef.value.uncontrolledShow = true;
          selectRef.value.$el.querySelector("input")?.focus();
        }
      });
    }
    function handleChange() {
      if (props.value !== inputValue.value)
        props.onUpdateValue(inputValue.value);
      isEdit.value = false;
      inputValue.value = props.value;
    }
    const onUpdateValue = (val) => {
      if (props.value !== val) props.onUpdateValue(val);
      isEdit.value = false;
      inputValue.value = props.value;
    };
    return () => (
      <div onClick={handleOnClick}>
        {isEdit.value ? (
          <n-select
            ref={selectRef}
            consistentMenuWidth={false}
            placeholder="lane"
            filterable={true}
            options={props.options}
            onBlur={handleChange}
            value={inputValue.value}
            onUpdateValue={onUpdateValue}
          />
        ) : props.value ? (
          props.value
        ) : (
          <span class="block p-4"></span>
        )}
      </div>
    );
  },
});

export const Lights = defineComponent({
  props: ["row"],
  setup(props) {
    return () => (
      <div class="flex items-center justify-center gap-x-1">
        {props.row.green_light ? (
          <span>
            <svg
              class="h-4 w-4"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="8" cy="8" r="8" fill="#4EB233" />
              <circle
                cx="8"
                cy="8"
                r="7.5"
                stroke="white"
                stroke-opacity="0.38"
              />
            </svg>
          </span>
        ) : null}
        {props.row.yellow_light ? (
          <span>
            <svg
              class="h-4 w-4"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="8" cy="8" r="8" fill="#CAC209" />
              <circle
                cx="8"
                cy="8"
                r="7.5"
                stroke="white"
                stroke-opacity="0.38"
              />
            </svg>
          </span>
        ) : null}
        {props.row.red_light ? (
          <span>
            <svg
              class="h-4 w-4"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="8" cy="8" r="8" fill="#CA0909" />
              <circle
                cx="8"
                cy="8"
                r="7.5"
                stroke="white"
                stroke-opacity="0.38"
              />
            </svg>
          </span>
        ) : null}
        {props.row.blue_light ? (
          <span>
            <svg
              class="h-4 w-4"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="8" cy="8" r="8" fill="#027BFF" />
              <circle
                cx="8"
                cy="8"
                r="7.5"
                stroke="white"
                stroke-opacity="0.38"
              />
            </svg>
          </span>
        ) : null}
      </div>
    );
  },
});
