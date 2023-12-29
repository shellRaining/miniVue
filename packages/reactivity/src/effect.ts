type Dep = Set<ReactiveEffect>;
type EffectOpts = {
  scheduler?: Function;
};
type EffectRunner = Function;

let activeEffect: ReactiveEffect | null;
const targetMap = new Map<object, Map<PropertyKey, Dep>>();

class ReactiveEffect {
  private _fn: Function;
  public scheduler: Function | undefined;
  constructor(fn: Function, scheduler?: Function) {
    this._fn = fn;
    this.scheduler = scheduler;
  }

  run() {
    activeEffect = this;
    this._fn();
    activeEffect = null;
  }
}

function getDep(target: object, key: PropertyKey, create: false): Dep | null;
function getDep(target: object, key: PropertyKey, create: true): Dep;
function getDep(target: object, key: PropertyKey, create: boolean): Dep | null {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    if (!create) {
      return null;
    }
    depsMap = new Map<PropertyKey, Dep>();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    if (!create) {
      return null;
    }
    dep = new Set<ReactiveEffect>();
    depsMap.set(key, dep);
  }

  return dep;
}

function trackEffects(dep: Dep) {
  if (!activeEffect) return;
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
  }
}

export function track(target: object, key: PropertyKey): void {
  if (activeEffect === null) {
    return;
  }

  const dep = getDep(target, key, true);
  trackEffects(dep);
}

function triggerEffects(dep: Dep) {
  for (const effect of dep) {
    effect.scheduler ? effect.scheduler() : effect.run();
  }
}

export function trigger(target: object, key: PropertyKey) {
  const dep = getDep(target, key, false);
  if (!dep) {
    console.warn("not found dep");
    return;
  }

  triggerEffects(dep);
}

// TODO: what is Typescript Function type
export function effect(fn: Function, opts?: EffectOpts): EffectRunner {
  const effect = new ReactiveEffect(fn, opts?.scheduler);
  effect.run();
  return effect.run.bind(effect);
}
